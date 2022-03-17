import Tooltip from './Tooltip';
import { window, document } from 'global';
import { saveState, loadState } from './localStorage';
import isEqual from 'lodash.isequal';

import { GuideType } from './types';

// TODO add regex path type (for a path like /[companyName]/dashboard)
// TODO make it installable
// TODO make it usable with all the hooks and all that


export default class Guide {
  readonly guideData: GuideType;
  private activeStep: number;
  private finished: boolean;
  private prematurelyClosed: boolean;
  private activeStepInstance: any;

  constructor(guideData: GuideType) {
    this.guideData = guideData;
    this.setInitialState();
  }

  private hasGuideDataChanged(): boolean {
    console.log('checking if guide data has changed');
    const localData = loadState();
    console.log(localData);
    // WARN localData is undefined, how did Lusift class let this happen
    if(!localData[this.guideData.id]) return true;
    const localGuideData = localData[this.guideData.id];
    delete localGuideData.activeStep;
    delete localGuideData.finished;
    delete localGuideData.prematurelyClosed;
    return !isEqual(localGuideData, this.guideData);
  }

  private setInitialState() {
    // compare data with localstorage
    // set tracking state accordingly

    console.log('setting initial stte')
    if(this.hasGuideDataChanged()) {
      console.log('guide data changed');
      this.activeStep=0;
      const newState = {
        [this.guideData.id]: {
          ...this.guideData
        }
      }
      saveState(newState);

    } else {
      const { data, activeStep, finished, prematurelyClosed } = loadState()[this.guideData.id];
      /* console.log('locally saved data:');
      console.log(data);
      console.log('incoming:');
      console.log(this.guideData) */
      console.log(`saved active step: ${activeStep}`)

      console.log('guide data unchanged');
      this.activeStep=activeStep || 0;
      this.finished=finished;
      this.prematurelyClosed=prematurelyClosed;

    }
    console.log(`Starting with step: ${this.activeStep}`);
  }

  public start(): void {
    console.info('Launching guide');
    this.attemptShow();
  }

  public attemptShow(): void {
    // call on Guide init, page load, and Lusift.refresh()

    window.setTimeout(() => {

      if(!this.guideData.steps[this.activeStep] || this.finished || this.prematurelyClosed) return;

      const { activeStep } = this;
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

  private showStep(stepIndex: number) {
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

  public setStep(newStepNum: number) {
    // change step and see which steps need to be unmounted or mounted
    // this.closeCurrentStep();
    let newState;

    if (newStepNum+1>this.guideData.steps.length) {
      this.finished=true;
      // save to localstorage
      const existingState = loadState();
      newState = {
        ...existingState,
        [this.guideData.id]: {
          ...existingState[this.guideData.id],
          finished: this.finished
        }
      }

      console.log('guide finished');

    } else if (newStepNum<0) {
      return console.log('Step index can\'t be less than 0');
    } else {
      this.activeStep=newStepNum;
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

    this.prematurelyClosed=true;
    // save to localstorage
    const existingState = loadState();
    const newState = {
      ...existingState,
      [this.guideData.id]: {
        ...existingState[this.guideData.id],
        prematurelyClosed: this.prematurelyClosed
      }
    }
    saveState(newState);
    console.log(existingState)
    console.log(newState);
    this.activeStepInstance.remove();
    console.log('guide closed');
  }

  private jumpToStep(stepNum: number) {
    this.setStep(stepNum);
  }

  private closeCurrentStep() {
    this.activeStepInstance.remove();
  }

  private nextStep() {
    const newStep = this.activeStep+1;
    this.closeCurrentStep();
    this.setStep(newStep);
  }

  private prevStep() {
    const newStep = this.activeStep-1;
    this.closeCurrentStep();
    this.setStep(newStep);
  }
}

