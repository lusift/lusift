import Tooltip from './Tooltip';
import Hotspot from './Hotspot';
import Modal from './Modal';
import { window, document } from 'global';
import { saveState, loadState } from './localStorage';

import { GuideType } from './types';

// TODO catch the case when window is undefined in localStorage.ts file
// TODO when should the last step be registered as closed prematurely vs finished
// TODO add regex path type (for a path like /[companyName]/dashboard)
// TODO make it installable

interface TrackingState {
  activeStep: number;
  finished: boolean;
  prematurelyClosed: boolean;
}

export default class Guide {
  readonly guideData: GuideType;
  private trackingState: TrackingState = {
    activeStep: 0,
    finished: undefined,
    prematurelyClosed: undefined
  };
  private activeStepInstance: any;

  constructor(guideID: string) {
    // localGuideState consists of trackingState and guideData
    console.log('%c Guide constructor! ', 'background: #222; color: #bada55');
    // console.log(loadState());
    const localGuideState = loadState()[guideID];
    const guideData = Object.assign({}, localGuideState);
    delete guideData.trackingState;

    this.guideData = guideData;
    this.trackingState = localGuideState.trackingState || this.trackingState;
    /* console.log('guideData pulled from local storage:');
       console.log(this.guideData);
       console.log(this.trackingState); */
    /* new Hotspot();
    new Modal(); */
  }

  public start(): void {
    console.info('Launching guide');
    this.attemptShow();
  }

  private stepMatchesDisplayCriteria(stepIndex: number): boolean {
    let criteriaMatch = this.doesStepPathMatch(stepIndex);
    if(this.guideData.steps[stepIndex].type !=='modal') {
      criteriaMatch = criteriaMatch && this.isStepElementFound(stepIndex);
    }
    return criteriaMatch;
  }

  private attemptShow(): void {
    // call on Guide init, page load, and Lusift.refresh()
    // TODO case for Modal
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

      if (this.stepMatchesDisplayCriteria(stepIndex)) {
        console.log(`Step ${stepIndex}: target path and element matched`);
        if(!this.activeStepInstance) {
          this.startStep(stepIndex);
        }
      } else {
        console.log(`Step ${stepIndex}: Either targetPath doesn\'t match or element not found`);
      }
    }
    while (steps[stepIndex].async && steps[stepIndex].type==='hotspot')
  }

  private startStep(stepIndex: number): void {
    const stepData = this.guideData.steps[stepIndex];
    const { index, target, type, data } = stepData;
    const guideID = this.guideData.id;
    // console.log(`Step index: ${index}`);

    if (type==='tooltip') {
      /* console.log(this.activeStepInstance);
         this.activeStepInstance.show(); */
      const { actions, styleProps } = stepData;

      this.activeStepInstance = new Tooltip({
        target,
        data,
        index,
        guideID,
        actions,
        styleProps
      });
    } else if (type==='modal') {
      this.activeStepInstance = new Modal({
        index,
        guideID,
        data
      });

    } else if (type==='hotspot') {
      this.activeStepInstance = new Hotspot({
        data: stepData,
        guideID,
      });
      if(stepData.async) {
        this.activeStepInstance = null;
      }
    }
  }

  private doesStepPathMatch(stepIndex: number): boolean {
    // is, endsWith, startsWith, contains
    const { value, comparator } = this.guideData.steps[stepIndex].target.path;
    const { pathname } = window.location;
    /* console.log('value, pathname, comparator:')
    console.log(value, pathname, comparator) */
    switch(comparator) {
      case 'is':
        return pathname===value;
      case 'contains':
        return pathname.includes(value);
      case 'endsWith':
        return pathname.endsWith(value);
      case 'startWith':
        return pathname.startsWith(value);
    }
  }

  private isStepElementFound(stepIndex: number): boolean {
    /* console.log(this.guideData);
    console.log('checking if element exists') */
    return Boolean(document.querySelector(this.guideData.steps[stepIndex].target.elementSelector));
  }

  private updateLocalTrackingState(): void {
    // save/sync class object to localstorage
    const existingState = loadState();
    const newState = {
      ...existingState,
      [this.guideData.id]: {
        ...existingState[this.guideData.id],
        trackingState: this.trackingState
      }
    }
    saveState(newState);
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
    if (newStepNum<0) {
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
    this.trackingState.prematurelyClosed=true;
    this.updateLocalTrackingState();
    this.closeCurrentStep();
    console.log('guide closed');
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
  }
}
