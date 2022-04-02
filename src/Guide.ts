import { window } from 'global';
import { saveState, loadState } from './localStorage';
import doesStepMatchDisplayCriteria from './doesStepMatchDisplayCriteria';
import startStepInstance from './startStepInstance';

import { GuideType, TrackingState } from './types';

// TODO make it installable
// TODO add progress bar
// TODO navigating to different page still shows element,
// is it the case for other elements as well, like tooltip?

export default class Guide {
  readonly guideData: GuideType;
  private trackingState: TrackingState;
  private activeStepInstance: any;

  constructor(guideID: string) {
    // localGuideState consists of trackingState and guideData
    console.log('%c Guide constructor! ', 'background: #222; color: #bada55');
    // console.log(loadState());
    const localGuideState = loadState()[guideID];
    const guideData = Object.assign({}, localGuideState);
    delete guideData.trackingState;

    this.guideData = guideData;
    this.trackingState = localGuideState.trackingState || this.generateTrackingState();
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
    const { activeStep, finished, prematurelyClosed } = this.trackingState;
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
        if(!this.activeStepInstance) {
          this.activeStepInstance = startStepInstance(
            steps[stepIndex],
            this.guideData.id
          );
        }
      } else {
        console.log(`Step ${stepIndex}: Either targetPath doesn\'t match or element not found`);
      }
    }
    while (steps[stepIndex].async && steps[stepIndex].type==='hotspot')
    // start all the async hotpots with toOpen true
    steps.forEach(({ async, type, index, target }) => {
      if(async && (type==='hotspot')) {
        if(doesStepMatchDisplayCriteria({ target, type }) && this.trackingState.asyncSteps[index].toOpen) {
          this.activeStepInstance = startStepInstance(
            steps[stepIndex],
            this.guideData.id
          );
        }
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
