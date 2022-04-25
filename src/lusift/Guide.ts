import { window } from 'global';
import { saveState, loadState } from '../common/store';
import { changeAsyncStepStatus, startStepInstance, doesStepMatchDisplayCriteria } from '../common/utils';

import { GuideType, TrackingState } from '../common/types';

// TODO: types for stepInstance, activeSteps. Possibly create an intermediary class Step

export default class Guide {
  readonly guideData: GuideType;
  // TODO: add type for below prop
  private activeSteps: any[] = [];
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
      currentStepIndex: 0,
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
      console.error('Guide is already finished or closed');
    } else {
      this.attemptToShowActiveStep();
    }
  }

  private removeAllActiveSteps(): void {
    this.activeSteps.forEach(stepInstance => {
      // instance.reRenderPageElements();
      const { type, target, instance, async } = stepInstance;
      if(async && type === 'hotspot') {
        instance.removeResizeObservers();
      }
      instance.remove();
    });
    this.activeSteps=[];
  }

  public reRenderStepElements(): void {
    console.log('re-render step elements');
    this.removeAllActiveSteps();
    this.start();
  }

  private attemptToShowActiveStep(): void {
    // we start with some currentStep from this.trackingState
    // if the step is async, set toOpen to true
    //-- if display criteria matches and step isn't already displayed, then startStep
    // if the step is async, loop back with stepIndex++
    const { currentStepIndex } = this.getTrackingState();
    let stepIndex=currentStepIndex;
    const steps = this.guideData.steps;
    let isAsyncStep: boolean;

    stepIndex--;
    do {
      stepIndex++;
      const { target, type, async } = steps[stepIndex];
      const displayCriteriaMatches = doesStepMatchDisplayCriteria({
        target,
        type
      });
      isAsyncStep = async && type === 'hotspot';

      if (isAsyncStep){
        changeAsyncStepStatus(stepIndex, true);
      }
      if(displayCriteriaMatches && !this.isStepAlreadyActive(stepIndex)) {
        this.activeSteps.push({
          index: stepIndex,
          instance: startStepInstance(
            steps[stepIndex],
            this.guideData.id
          ),
          target,
          type,
          async
        });
      }
    }
    while (isAsyncStep)

    let newTrackingState = this.getTrackingState();
    newTrackingState.currentStepIndex=stepIndex;
    this.setTrackingState(newTrackingState);
  }

  private isStepAlreadyActive(stepIndex: number): boolean {
    return this.activeSteps.some(({ index }) => index === stepIndex);
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
          this.activeSteps.push({
            index,
            instance: startStepInstance(
              steps[index],
              this.guideData.id
            ),
            target,
            type,
            async
          });
        }
      }
    });
  }

  private removeIllegalSteps(): void {
    this.activeSteps = this.activeSteps.filter(stepInstance => {
      // if step display criteria doesn't match, then run remove() and remove from this.activeSteps
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
      newTrackingState.currentStepIndex=newStepNum;
      this.setTrackingState(newTrackingState);
      this.start();
    }
  }

  private close(): void {
    // close guide
    // if current step is last step then finished=true, else prematurelyClosed=true
    let newTrackingState = this.getTrackingState();
    if(newTrackingState.currentStepIndex+1 === this.guideData.steps.length) {
      newTrackingState.finished = true;
    } else {
      newTrackingState.prematurelyClosed=true;
    }
    this.setTrackingState(newTrackingState);
    this.removeAllActiveSteps();
    window.Lusift.activeGuide = null;
    console.log('guide closed');
    typeof window.Lusift.onClose === 'function' && window.Lusift.onClose();
  }

  private closeCurrentStep(): void {
    // if this.trackingState.activeStep is equal to any index of item from this.activeSteps, then console.log('hello')
    const { currentStepIndex } = this.getTrackingState();
    const currentStep = this.activeSteps.find(({ index }) => index === currentStepIndex);

    if(currentStep) {
      currentStep.instance.remove();
      this.activeSteps = this.activeSteps
        .filter(instance => instance.index !== currentStepIndex);

    } else {
      console.warn('There\'s no active step to close');
    }
  }

  private nextStep(): void {
    const newStep = this.getTrackingState().currentStepIndex+1;
    if (newStep+1>this.guideData.steps.length) {
      return console.warn('No new steps');
    }
    this.closeCurrentStep();
    this.setStep(newStep);
    typeof window.Lusift.onNext === 'function' && window.Lusift.onNext();
  }
  // TODO: even when setStep console warns closeCurrentStep still runs, fix this

  private prevStep(): void {
    // make newStep the index of the closest previus step with !step.async
    let newStep = this.getTrackingState().currentStepIndex;

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
