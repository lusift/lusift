import Tooltip from './Tooltip';
import { window, document } from 'global';
import { saveState, loadState } from './localStorage';
import isEqual from 'lodash.isequal';

import { GuideType } from './types';

// TODO add regex path type (for a path like /[companyName]/dashboard)
// TODO make it installable
// TODO make it usable with all the hooks and all that
// TODO add methods to target elements with click listeners to move to next step
// TODO reformat guide object to add trackingState object property

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

  constructor(guideData: GuideType) {
    this.guideData = guideData;
    this.setInitialState();
  }

  private hasGuideDataChanged(): boolean {
    console.log('checking if guide data has changed');
    const localData = loadState();
    console.log(localData);
    if(!localData[this.guideData.id]) return true;
    const localGuideData = localData[this.guideData.id];
    delete localGuideData.trackingState;
    return !isEqual(localGuideData, this.guideData);
  }

  private setInitialState() {
    // compare data with localstorage
    // set tracking state accordingly

    console.log('setting initial stte')
    if(this.hasGuideDataChanged()) {
      console.log('guide data changed');
      this.trackingState.activeStep=0;
      const newState = {
        [this.guideData.id]: {
          ...this.guideData
        }
      }
      saveState(newState);

    } else {
      // TODO The below is erroring out because loadState() could be an empty object
      // We may need to change this entire function and instead of checking if data has changed alone,
      // see if it's empty and fill it with placeholder. Map those different conditions
      let trackingState = loadState()[this.guideData.id].trackingState || {};
      const { activeStep, finished, prematurelyClosed } = trackingState;
      /* console.log('locally saved data:');
      console.log(data);
      console.log('incoming:');
      console.log(this.guideData) */
      console.log(`saved active step: ${activeStep}`)

      console.log('guide data unchanged');
      this.trackingState = {
        activeStep: activeStep || 0,
        finished,
        prematurelyClosed
      }
    }
    console.log(`Starting with step: ${this.trackingState.activeStep}`);
  }

  public start(): void {
    console.info('Launching guide');
    this.attemptShow();
  }

  public attemptShow(): void {
    // call on Guide init, page load, and Lusift.refresh()

    window.setTimeout(() => {

      const { activeStep, finished, prematurelyClosed } = this.trackingState;
      if(!this.guideData.steps[activeStep] || finished || prematurelyClosed) return;

      if (this.doesTargetPathMatch(activeStep) && this.isTargetElementFound(activeStep)) {
        console.log('target path and element matched');
        this.showStep(activeStep);
      } else {
        console.log('Either targetPath doesn\'t match or element not found');
        // remove steps that shouldn't apply to the current page

        if(this.activeStepInstance) {
          console.log('target selectors no longer matching, removing');
          this.activeStepInstance.remove();
        }
      }
    }, 0);
  }

  private showStep(stepIndex: number): void {
    const { index, target, data, type } = this.guideData.steps[stepIndex];
    console.log(`Step index: ${index}`);

    // TODO make nextStep and prevStep be conditional and optional
    if (type==='tooltip') {
      this.activeStepInstance = new Tooltip({
        target,
        data,
        index,
        guideID: this.guideData.id,
        nextStep: this.nextStep.bind(this),
        prevStep: this.prevStep.bind(this),
        closeGuide: this.close.bind(this)
      });
    } else if (type==='modal') {

    } else {

    }
  }

  private doesTargetPathMatch(stepIndex: number): boolean {
    // is, endsWith, startsWith, contains
    const { value, comparator } = this.guideData.steps[stepIndex].target.path;
    const { pathname } = window.location;
    console.log('value, pathname, comparator:')
    console.log(value, pathname, comparator)
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

  private isTargetElementFound(stepIndex: number): boolean {
    console.log(this.guideData);
    console.log('checking if element exists')
    return Boolean(document.querySelector(this.guideData.steps[stepIndex].target.elementSelector));
  }

  public setStep(newStepNum: number): void {
    // change step and see which steps need to be unmounted or mounted
    // this.closeCurrentStep();
    let newState;
    const { activeStep, finished, prematurelyClosed } = this.trackingState;

    if (newStepNum+1>this.guideData.steps.length) {
      this.trackingState.finished=true;
      // save to localstorage
      const existingState = loadState();
      newState = {
        ...existingState,
        [this.guideData.id]: {
          ...existingState[this.guideData.id],
          finished: this.trackingState.finished
        }
      }

      console.log('guide finished');

    } else if (newStepNum<0) {
      return console.log('Step index can\'t be less than 0');
    } else {
      this.trackingState.activeStep=newStepNum;
      // save to localstorage
      const existingState = loadState();
      newState = {
        ...existingState,
        [this.guideData.id]: {
          ...existingState[this.guideData.id],
          activeStep: newStepNum
        }
      }
      this.attemptShow();
    }

    saveState(newState);
    console.log('new state:')
    console.log(newState);
    console.log(loadState())
  }

  public close(): void {
    // close guide

    this.trackingState.prematurelyClosed=true;
    // save to localstorage
    const existingState = loadState();
    const newState = {
      ...existingState,
      [this.guideData.id]: {
        ...existingState[this.guideData.id],
        prematurelyClosed: this.trackingState.prematurelyClosed
      }
    }
    saveState(newState);
    console.log(existingState)
    console.log(newState);
    this.activeStepInstance.remove();
    console.log('guide closed');
  }

  private jumpToStep(stepNum: number): void {
    this.setStep(stepNum);
  }

  private closeCurrentStep(): void {
    this.activeStepInstance.remove();
  }

  private nextStep(): void {
    const newStep = this.trackingState.activeStep+1;
    this.closeCurrentStep();
    this.setStep(newStep);
  }

  private prevStep(): void {
    const newStep = this.trackingState.activeStep-1;
    this.closeCurrentStep();
    this.setStep(newStep);
  }
}

