import { window } from 'global';
import { saveState, loadState } from './localStorage';
import doesStepMatchDisplayCriteria from './doesStepMatchDisplayCriteria';
import { changeAsyncStepStatus } from './utils';
import startStepInstance from './startStepInstance';

import { GuideType, TrackingState } from './types';

// TODO make it installable
// TODO add base global css
// TODO refactor this class
// TODO fix type definitions

export default class Guide {
  readonly guideData: GuideType;
  private trackingState: TrackingState;
  private activeStepInstance: any;
  private activeStepInstances: any[] = [];

  constructor(guideID: string) {
    // localGuideState consists of trackingState and guideData
    const localGuideState = loadState()[guideID];
    const guideData = Object.assign({}, localGuideState);
    delete guideData.trackingState;

    this.guideData = guideData;
    console.log(`%c Welcome to guide: ${this.guideData.name || this.guideData.id}`, 'background: #222; color: #bada55');
    this.trackingState = localGuideState.trackingState || this.generateTrackingState();
    this.updateLocalTrackingState();
  }

  private generateTrackingState(): any {
    let newTrackingState = {
      activeStep: 0,
      finished: undefined,
      prematurelyClosed: undefined,
      asyncSteps: {}
    };

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
    console.log('start begin-----------');
    const { finished, prematurelyClosed } = this.trackingState;
    this.removeIllegalSteps();
    this.attemptToStartAsyncSteps();
    // if finished or completed
    if(finished || prematurelyClosed) {
      console.log('Guide is already finished or closed');
    } else {
      this.attemptToShowActiveStep();
    }
    console.log('start end-------------');
  }

  private attemptToShowActiveStep(): void {
    // we start with some activeStep from this.trackingState
    // if the step is async, set toOpen to true
    // if display criteria matches and step isn't already displayed, then startStep
    // if the step is async, loop back with stepIndex++
    const { activeStep } = this.trackingState;
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
        this.trackingState = loadState()[this.guideData.id].trackingState;
      }
      if(displayCriteriaMatches && !this.stepAlreadyActive(stepIndex)) {
        this.activeStepInstance = startStepInstance(
          steps[stepIndex],
          this.guideData.id
        );
        this.activeStepInstances.push({
          instance: this.activeStepInstance,
          index: stepIndex,
          target,
          type
        });
      }
    }
    while (isAsyncStep)
    this.trackingState.activeStep=stepIndex;
    this.updateLocalTrackingState();
  }

  private stepAlreadyActive(stepIndex: number): boolean {
    return this.activeStepInstances.some(stepInstance => stepInstance.index === stepIndex);
  }

  private attemptToStartAsyncSteps(): void {
    // start all the async hotpots with toOpen true
    const steps = this.guideData.steps;
    steps.forEach(({ async, type, index, target }) => {
      if(async && (type==='hotspot')) {
        if(doesStepMatchDisplayCriteria({ target, type }) && this.trackingState.asyncSteps[index].toOpen) {
          console.log(`Step ${index}: target path and element matched. toOpen is true`);
          // if step is already active console.warn that the step is already active
          if(this.stepAlreadyActive(index)) {
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
            type
          });
          this.activeStepInstance = null;
        }
      }
    });
  }

  private removeIllegalSteps(): void {
    this.activeStepInstances.forEach(stepInstance => {
      // if step display criteria doesn't match, then run remove() and remove from this.activeStepInstances
      if(!doesStepMatchDisplayCriteria({ target: stepInstance.target, type: stepInstance.type })) {
        stepInstance.instance.remove();
        this.activeStepInstances.splice(this.activeStepInstances.indexOf(stepInstance), 1);
      }
    });
  }

  private updateLocalTrackingState(): void {
    // save/sync class object to localstorage
    const existingState = loadState();
    saveState({
      ...existingState,
      [this.guideData.id]: {
        ...existingState[this.guideData.id],
        trackingState: this.trackingState
      }
    });
  }

  private clearTrackingState(): void {
    this.trackingState = undefined;
    this.updateLocalTrackingState();
  }

  public setStep(newStepNum: number): void {
    // change step and see which steps need to be unmounted or mounted
    // this.closeCurrentStep();
    if (newStepNum < 0) {
      return console.warn('Step index can\'t be less than 0');
    } else if (newStepNum+1>this.guideData.steps.length) {
      this.trackingState.finished=true;
      console.log('guide finished');

    } else {
      this.trackingState.activeStep=newStepNum;
      this.start();
    }
    this.updateLocalTrackingState();
  }

  private close(): void {
    // close guide
    // if current step is last step then finished=true, else prematurelyClosed=true
    if(this.trackingState.activeStep+1 === this.guideData.steps.length) {
      this.trackingState.finished = true;
    } else {
      this.trackingState.prematurelyClosed=true;
    }
    this.updateLocalTrackingState();
    this.closeCurrentStep();
    console.log('guide closed');
    typeof window.Lusift.onClose === 'function' && window.Lusift.onClose();
  }

  private closeCurrentStep(): void {
    if(this.activeStepInstance) {
      this.activeStepInstance.remove();
      this.activeStepInstances = this.activeStepInstances.filter(instance => instance.index !==this.trackingState.activeStep);
      this.activeStepInstance = null;
    } else {
      console.warn('There\'s no active step to close');
    }
  }

  private nextStep(): void {
    const newStep = this.trackingState.activeStep+1;
    if (newStep+1>this.guideData.steps.length) {
      return console.warn('No new steps');
    }
    this.closeCurrentStep();
    this.setStep(newStep);
    typeof window.Lusift.onNext === 'function' && window.Lusift.onNext();
  }

  private prevStep(): void {
    // make newStep the index of the closest previus step with !step.async
    let newStep = this.trackingState.activeStep;
    while(newStep>-2) {
      newStep--;
      let stepIsAsync = this.guideData.steps[newStep].type ==='hotspot' && this.guideData.steps[newStep].async;
      if(stepIsAsync){
        break;
      }
    }
    this.closeCurrentStep();
    this.setStep(newStep);
    typeof window.Lusift.onPrev === 'function' && window.Lusift.onPrev();
  }
}
