import { window } from 'global';
import { saveState, loadState } from '../common/store';
import { changeAsyncStepStatus, startStepInstance, doesStepMatchDisplayCriteria } from '../common/utils';

import { GuideType, TrackingState } from '../common/types';

// TODO types for stepInstance, activeStepInstances. Possibly create an intermediary class Step

export default class Guide {
  readonly guideData: GuideType;
  private activeStepInstance: any;
  private activeStepInstances: any[] = [];
  // ^For limited use only, doesn't update after a step is closed

  constructor(guideID: string) {
    // localGuideState consists of trackingState and guideData
    console.log('guide constructor');
    console.log(loadState())
    const localGuideState = loadState()[guideID];
    const guideData = Object.assign({}, localGuideState);
    delete guideData.trackingState;

    this.guideData = guideData;
    console.log(`%c Welcome to guide: ${this.guideData.name || this.guideData.id}`, 'background: #222; color: #bada55');

    if(!localGuideState.trackingState){
      const newTrackingState = this.generateNewTrackingState();
      this.setTrackingState(newTrackingState);
    }
  }

  private generateNewTrackingState(): TrackingState {
    let newTrackingState = {
      activeStep: 0,
      finished: undefined,
      prematurelyClosed: undefined,
      asyncSteps: {}
    };

    //for async steps
    this.guideData.steps.forEach(step => {
      if(step.async && step.type==='hotspot') {
        newTrackingState.asyncSteps[step.index] = {
          toOpen: false
        }
      }
    });
    return newTrackingState;
  }

  public start(): void {
    const { finished, prematurelyClosed } = this.getTrackingState();
    this.removeIllegalSteps();
    this.attemptToStartAsyncSteps();

    if(finished || prematurelyClosed) {
      console.warn('Guide is already finished or closed');
    } else {
      this.attemptToShowActiveStep();
    }
  }

  private attemptToShowActiveStep(): void {
    // we start with some activeStep from this.trackingState
    // if the step is async, set toOpen to true
    // if display criteria matches and step isn't already displayed, then startStep
    // if the step is async, loop back with stepIndex++
    const { activeStep } = this.getTrackingState();
    let stepIndex=activeStep-1;
    const steps = this.guideData.steps;
    let isAsyncStep: boolean;

    do {
      stepIndex++;
      const { target, type, async } = steps[stepIndex];
      const displayCriteriaMatches = doesStepMatchDisplayCriteria({ target, type });
      isAsyncStep = async && type === 'hotspot';

      if (isAsyncStep){
        changeAsyncStepStatus(stepIndex, true);
      }
      if(displayCriteriaMatches && !this.isStepAlreadyActive(stepIndex)) {
        this.activeStepInstance = startStepInstance(
          steps[stepIndex],
          this.guideData.id
        );
        this.activeStepInstances.push({
          instance: this.activeStepInstance,
          index: stepIndex,
          target,
          type,
          async
        });
      }
    }
    while (isAsyncStep)

    let newTrackingState = this.getTrackingState();
    newTrackingState.activeStep=stepIndex;
    this.setTrackingState(newTrackingState);
  }

  private isStepAlreadyActive(stepIndex: number): boolean {
    return this.activeStepInstances.some(stepInstance => stepInstance.index === stepIndex);
  }

  private attemptToStartAsyncSteps(): void {
    // start all the async hotpots with toOpen true
    const steps = this.guideData.steps;
    steps.forEach(({ async, type, index, target }) => {
      if(async && (type==='hotspot')) {
        if(doesStepMatchDisplayCriteria({ target, type }) && this.getTrackingState().asyncSteps[index].toOpen) {
          console.log(`Step ${index}: target path and element matched. toOpen is true`);
          // if step is already active console.warn that the step is already active
          if(this.isStepAlreadyActive(index)) {
            return console.warn(`Step ${index} is already active`);
          }
          this.activeStepInstance = startStepInstance(
            steps[index],
            this.guideData.id
          );
          this.activeStepInstances.push({
            index,
            instance: this.activeStepInstance,
            target,
            type,
            async
          });
          this.activeStepInstance = null;
        }
      }
    });
  }

  private removeIllegalSteps(): void {
    this.activeStepInstances = this.activeStepInstances.filter(stepInstance => {
      // if step display criteria doesn't match, then run remove() and remove from this.activeStepInstances
      const { type, target, instance, async } = stepInstance;
      if(!doesStepMatchDisplayCriteria({ target, type })) {
        if(async && type === 'hotspot') {
          instance.removeResizeObservers();
        }
        instance.remove();
        return false;
      } else {
        return true;
      }
    });
  }

  private setTrackingState(trackingState: TrackingState): void {
    const existingState = loadState();
    saveState({
      ...existingState,
      [this.guideData.id]: {
        ...existingState[this.guideData.id],
        trackingState
      }
    });
  }

  public getTrackingState(): TrackingState {
    return loadState()[this.guideData.id].trackingState;
  }

  private clearTrackingState(): void {
    this.setTrackingState(undefined);
  }

  public setStep(newStepNum: number): void {
    // change step and see which steps need to be unmounted or mounted
    let newTrackingState = this.getTrackingState();
    if (newStepNum < 0) {
      return console.warn('Step index can\'t be less than 0');
    } else if (newStepNum+1>this.guideData.steps.length) {
      newTrackingState.finished = true;
      this.setTrackingState(newTrackingState);
      console.log('guide finished');

    } else {
      newTrackingState.activeStep=newStepNum;
      this.setTrackingState(newTrackingState);
      this.start();
    }
  }

  private close(): void {
    // close guide
    // if current step is last step then finished=true, else prematurelyClosed=true
    let newTrackingState = this.getTrackingState();
    if(newTrackingState.activeStep+1 === this.guideData.steps.length) {
      newTrackingState.finished = true;
    } else {
      newTrackingState.prematurelyClosed=true;
    }
    this.setTrackingState(newTrackingState);
    this.closeCurrentStep();
    console.log('guide closed');
    typeof window.Lusift.onClose === 'function' && window.Lusift.onClose();
  }

  private closeCurrentStep(): void {
    if(this.activeStepInstance) {
      this.activeStepInstance.remove();
      this.activeStepInstances = this.activeStepInstances
        .filter(instance => instance.index !==this.getTrackingState().activeStep);

      this.activeStepInstance = null;
    } else {
      console.warn('There\'s no active step to close');
    }
  }

  private nextStep(): void {
    const newStep = this.getTrackingState().activeStep+1;
    if (newStep+1>this.guideData.steps.length) {
      return console.warn('No new steps');
    }
    this.closeCurrentStep();
    this.setStep(newStep);
    typeof window.Lusift.onNext === 'function' && window.Lusift.onNext();
  }
  // TODO even when setStep console warns closeCurrentStep still runs, fix this

  private prevStep(): void {
    // make newStep the index of the closest previus step with !step.async
    let newStep = this.getTrackingState().activeStep;

    while(newStep>-2) {
      newStep--;
      const step = this.guideData.steps[newStep];
      if(!step) {
        break;
      }
      const { type, async } = step;
      let stepIsAsync = type ==='hotspot' && async;
      if(!stepIsAsync){
        break;
      }
    }
    this.closeCurrentStep();
    this.setStep(newStep);
    typeof window.Lusift.onPrev === 'function' && window.Lusift.onPrev();
  }
}
