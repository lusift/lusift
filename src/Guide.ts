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
// TODO this.stepDisplayed is fairly redundant, get rid of it

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
  private stepDisplayed: null | number = null;

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

  public attemptShowx(): void {
    // call on Guide init, page load, and Lusift.refresh()
    // TODO case where the step is already on display
    // TODO case for Modal

      console.log(`%c  ${this.stepDisplayed}`, 'background: #222; color: #bada55');
      const { activeStep, finished, prematurelyClosed } = this.trackingState;
      if(!this.guideData.steps[activeStep] || finished || prematurelyClosed) {
        return console.log('it\'s already finished or closed');
      }
      console.log('guide is not finished or closed yet');
      console.log(activeStep, finished, prematurelyClosed);
      console.log('Trying to display step '+activeStep);

      if (this.doesStepPathMatch(activeStep) && this.isStepElementFound(activeStep)) {
        console.log('target path and element matched');
        if(this.stepDisplayed === null) {
          this.startStep(activeStep);
        }
      } else {
        console.log('Either targetPath doesn\'t match or element not found');
        if(this.activeStepInstance) {
          // remove steps that shouldn't apply to the current page
          // TODO when is this possibly going to come to use??
          console.log('target selectors no longer matching, removing');
          // this.activeStepInstance.remove();
        }
      }
  }

  private attemptShow(): void {
    // call on Guide init, page load, and Lusift.refresh()
    // TODO case where the step is already on display
    // TODO case for Modal
    const { activeStep, finished, prematurelyClosed } = this.trackingState;
    if(finished || prematurelyClosed) {
      return console.log('Guide is already finished or closed');
    }
    console.log('guide is not finished or closed yet');
    let stepIndex=activeStep-1;
    // if the current step has async true, then try starting the next one, and so on
    do {
      stepIndex++;
      console.log('Trying to display step '+stepIndex);

      if (this.doesStepPathMatch(stepIndex) && this.isStepElementFound(stepIndex)) {
        console.log(`Step ${stepIndex}: target path and element matched`);
        if(this.stepDisplayed === null) {
          this.startStep(stepIndex);
        }
      } else {
        console.log(`Step ${stepIndex}: Either targetPath doesn\'t match or element not found`);
      }
    }
    while (this.guideData.steps[stepIndex].async && this.guideData.steps[stepIndex].type==='hotspot')
  }

  private startStep(stepIndex: number): void {
    const { index, target, data, actions, type, styleProps } = this.guideData.steps[stepIndex];
    // console.log(`Step index: ${index}`);
    console.log(`%c  ${this.stepDisplayed}`, 'background: #222; color: #bada55');

    if (type==='tooltip') {
      this.activeStepInstance = this.guideData.steps[stepIndex];
      /* console.log(this.activeStepInstance);
         this.activeStepInstance.show(); */
      this.activeStepInstance = new Tooltip({
        target,
        data,
        index,
        guideID: this.guideData.id,
        nextStep: this.nextStep.bind(this),
        prevStep: this.prevStep.bind(this),
        closeGuide: this.close.bind(this),
        actions,
        styleProps
      });
    } else if (type==='modal') {

    } else if (type==='hotspot') {
      const hotspot = this.guideData.steps[stepIndex];
      this.activeStepInstance = new Hotspot({
        data: hotspot,
        guideID: this.guideData.id,
        nextStep: this.nextStep.bind(this),
      });
      /* if(hotspot.async) {
        this.activeStepInstance = null;
        this.stepDisplayed = null;
        this.nextStep();
      } */
    }
    this.stepDisplayed = stepIndex;
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
    if(this.stepDisplayed && this.activeStepInstance) {
      this.activeStepInstance.remove();
      this.stepDisplayed = null;
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
