import { window } from 'global';
import { saveState, loadState } from './localStorage';
import doesStepMatchDisplayCriteria from './doesStepMatchDisplayCriteria';
import startStepInstance from './startStepInstance';

import { GuideType, TrackingState } from './types';

// TODO make it installable
// TODO add base global css

export default class Guide {
  readonly guideData: GuideType;
  private trackingState: TrackingState;
  private activeStepInstance: any;
  private activeStepInstances: any[] = [];

  constructor(guideID: string) {
    // localGuideState consists of trackingState and guideData
    console.log('%c Guide constructor! ', 'background: #222; color: #bada55');
    // console.log(loadState());
    const localGuideState = loadState()[guideID];
    const guideData = Object.assign({}, localGuideState);
    delete guideData.trackingState;

    this.guideData = guideData;
    this.trackingState = localGuideState.trackingState || this.generateTrackingState();
    this.updateLocalTrackingState();
    /* console.log('guideData pulled from local storage:');
       console.log(this.guideData);
       console.log(this.trackingState); */
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
    console.info('Launching guide');
    this.attemptShow();
  }

  private attemptShow(): void {
    // call on Guide init, page load, and Lusift.refresh()
    this.attemptRemove();
    this.attemptToOpenAsyncSteps();
    const { activeStep, finished, prematurelyClosed } = this.trackingState;
    console.log(this.activeStepInstances)
    if(finished || prematurelyClosed) {
      return console.log('Guide is already finished or closed');
    }
    console.log('guide is not finished or closed yet');
    let stepIndex=activeStep-1;
    const steps = this.guideData.steps;

    // if the current step has async true, then try starting the next one, and so on
    do {
      stepIndex++;
      console.log('Trying to display step '+stepIndex);

      let { target, type } = steps[stepIndex];

      if (doesStepMatchDisplayCriteria({ target, type })) {
        console.log(`Step ${stepIndex}: target path and element matched`);
        window.alert(`Step ${stepIndex}: target path and element matched`);
        if(this.stepAlreadyActive(stepIndex)){
          console.warn(`Step ${stepIndex} is already active`);
        } else {
          if(!this.activeStepInstance) {
            this.activeStepInstance = startStepInstance(
              steps[stepIndex],
              this.guideData.id
            );
            this.activeStepInstances.push({
              instance: this.activeStepInstance,
              target,
              type,
              index: stepIndex
            });
            if(steps[stepIndex].async && steps[stepIndex].type==='hotspot') {
              this.activeStepInstance = null;
            }
          }
        }
      } else {
        console.log(`Step ${stepIndex}: Either targetPath doesn\'t match or element not found`);
      }
    }
    while (steps[stepIndex].async && steps[stepIndex].type==='hotspot')
      console.log('Finished trying to display steps');
      console.log(this.activeStepInstances)
  }

  private stepAlreadyActive(stepIndex: number): boolean {
    return this.activeStepInstances.some(stepInstance => stepInstance.index === stepIndex);
  }

  private attemptToOpenAsyncSteps(): void {
    // start all the async hotpots with toOpen true
    const steps = this.guideData.steps;
    steps.forEach(({ async, type, index, target }) => {
      if(async && (type==='hotspot')) {
        if(doesStepMatchDisplayCriteria({ target, type }) && this.trackingState.asyncSteps[index].toOpen) {
          console.log(`Step ${index}: target path and element matched`);
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

  private attemptRemove(): void {
    window.alert('attempting to remove steps')
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
    /* console.log('new state:')
    console.log(newState);
    console.log(loadState()) */
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
      this.attemptShow();
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
      console.log(this.activeStepInstance)
      this.activeStepInstance.remove();
      this.activeStepInstance = null;
    } else {
      console.warn('There\'s no active step to close');
    }
  }

  private nextStep(): void {
    const newStep = this.trackingState.activeStep+1;
    this.closeCurrentStep();
    if (newStep+1>this.guideData.steps.length) {
      return console.warn('No new steps');
    }
    this.setStep(newStep);
    typeof window.Lusift.onNext === 'function' && window.Lusift.onNext();
  }

  private prevStep(): void {
    // make newStep the index of the closest previus step with !step.async
    let newStep = this.trackingState.activeStep;
    while(newStep>-2) {
      newStep--;
      if(this.guideData.steps[newStep].type !=='hotspot' || !this.guideData.steps[newStep].async){
        break;
      }
    }
    this.closeCurrentStep();
    this.setStep(newStep);
    typeof window.Lusift.onPrev === 'function' && window.Lusift.onPrev();
  }
}
