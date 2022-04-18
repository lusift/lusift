import Guide from './Guide';
import { saveState, loadState } from '../common/store';
import isEqual from 'lodash.isequal';
import { doesStepMatchDisplayCriteria, startStepInstance } from '../common/utils';

import { window, document } from 'global';

import { GuideType, Content, TrackingState } from '../common/types';
import { isOfTypeContent, isObject } from '../common/utils/isOfType';
import addDefaultCSS from './addDefaultCSS';

// TODO: Write documentation
// TODO: attach License
// TODO: push to npm and bower
// TODO: try globalThis instead of global package
//
// TODO: decide on making configuring easier, with inheritence, global levels, etc.
// TODO: add support for angul*r
// BUG: React component doesn't render for step(vanillaRender does) when the page is refreshed
// TODO: Make development easier.
// TODO: Test in client side react
// TODO: Customising beacon element
// TODO: Clean up the messy implementation of Tooltip and Backdrop
// --- when host site is in dev watch mode, lusift rendering gets all messed up. why?
// TODO: In case of customizing hotspot's beacon, we can just have a beaconElement property
// BUG: Why is it that the element is hidden beneath the overlay sometimes
// --- what are the condition for these cases and how to solve them?
// BUG: There's definitely some mess in goint from server side to client side
// -- suspected some faults with the document object Lusift is using
// package manager notes section at https://github.com/defunctzombie/node-process#readme (process is a dependency to global)
// BUG: So this page with 2 tooltip targets 1 after the other, when scrolling deactivates one tooltip (w/o clicking next), other
// BUG: Backdrop isn't being removed on client side rendering
// TODO: Reference react-modal package
// tooltip activates on target detection

class Lusift {
  private content: Content;
  private guideInstance: any;
  public render: Function;
  private contentSet: boolean;
  public activeGuideID: string;
  public progress: number = 0;

  private next: Function;
  private prev: Function;
  private close: Function;
  private goto: Function;
  private onNext: Function;
  private onPrev: Function;
  private onClose: Function;

  constructor() {
    console.log('%c Lusift constructor! ', 'background: #222; color: #bada55');

    const localData = loadState();
    // if loadState() type is not object,
    if(!isObject(localData)) {
      saveState({});
    }
    addDefaultCSS();
  }

  public setGlobalStyle(styleText: string): void {
    if(typeof styleText !== 'string') {
      return console.error('Invalid style passed to setGlobalStyle()');
    }
    let customStyle = document.querySelector('style[lusift-custom-css]');
    if(!customStyle) {
      return console.error('Style tag for custom-css not found. Report to project\'s github.');
    }
    customStyle.textContent = styleText;
  }

  public getTrackingState(): TrackingState {
    if(this.contentSet && this.activeGuideID) {
      return loadState()[this.activeGuideID].trackingState;
    } else {
      console.warn('No active guide');
      return null;
    }
  }

  private hasGuideDataChanged(guideData: GuideType): boolean {
    const localData = loadState();
    if(!localData[guideData.id]) return true;
    const localGuideData = localData[guideData.id];
    delete localGuideData.trackingState;
    const guideDataWithoutHooks = { ...guideData };
    delete guideDataWithoutHooks.onNext;
    delete guideDataWithoutHooks.onClose;
    delete guideDataWithoutHooks.onPrev;
    return !isEqual(localGuideData, guideDataWithoutHooks);
  }

  public devShowStep(guideID: string, stepNumber: number): void {
    // dev mode: to be used to develop/style step elements
    // if there is some other content active already, refuse to show dev mode
    if (typeof this.activeGuideID ==='string') {
      return console.warn('Can\'t enable dev mode because a guide is active using showContent()');
    }
    if(!this.content || !this.contentSet) {
      return console.warn(`Content not set, pass valid content object to setContent() before running devShowStep()`);
    }
    this.next = this.prev = this.close = this.showContent = function() {
      console.error(`Can't run this method in dev mode`);
    }

    if (this.content[guideID]) {
      const { steps } = this.content[guideID].data;
      const { target, type } = steps[stepNumber];

      if(!doesStepMatchDisplayCriteria({ target, type })) {
        return console.warn('Display criteria for step do not match. Navigate to\
                            the right target page and make sure that the target element\
                            is in the visible screen, then reload page.');
      }

      if (steps[stepNumber]) {
        startStepInstance(steps[stepNumber], guideID);
        console.log(`%c Showing step ${stepNumber} of ${guideID} in dev mode`, 'background: #222; color: #bada55');
      } else {
        console.error(`Guide '${guideID}' doesn't have a step ${stepNumber}`);
      }
    } else {
      console.error(`Guide with id '${guideID}' doesn't exist`);
    }
  }

  private reconcileContentWithLocalState(): void {
    // Look through each content item,
    // --clear tracking data if item data has changed
    // --conserve otherwise
    let stateToSave = {};

    Object.keys(this.content).forEach((key) => {
      if(this.content[key].type==='guide'){
        const guideData = this.content[key].data; //prolly a guide
        if(this.hasGuideDataChanged(guideData) && !guideData.doNotResetTrackerOnContentChange) {
          console.log(`guide with id '${key}' changed`);
          // clear tracking data
          stateToSave[guideData.id] = guideData;
        } else {
          // console.log(`${key} is unchanged`);
          const localGuideData = loadState()[guideData.id];
          stateToSave[guideData.id] = localGuideData;
        }
      }
    });
    saveState(stateToSave);
  }

  public setContent(content: Content): void {
    // filter and validate this.content
    if(!isOfTypeContent(content)) {
      return console.warn('Content data type is invalid');
    }
    this.content = content;

    this.contentSet = true;
    // console.log('filtering')
    Object.keys(this.content).forEach((key) => {

      const {
        id,
        name='',
        description='',
        steps,
        onNext,
        onPrev,
        onClose,
        doNotResetTrackerOnContentChange=false
      } = this.content[key].data;

      // remove bodyContent from steps
      let stepsWithoutBodyContent = steps.map(step => {
        if(step.type==='tooltip' || step.type==='modal') {
          delete step.data.bodyContent;
        } else if (step.type==='hotspot') {
          delete step.tip.data.bodyContent;
        }
        return step;
      })

      this.content[key].data = {
        id,
        name,
        description,
        steps: stepsWithoutBodyContent,
        onNext,
        onPrev,
        onClose,
        doNotResetTrackerOnContentChange
      };
    });

    // iterate through each content item to note changes and conditionally preserve trackingState
    // and then save to localStorage
    this.reconcileContentWithLocalState();
    //content has been set to local
  }

  public clearContent(): void {
    saveState({});
    this.content = {};
    this.contentSet = false;
  }

  public refresh(): void {
    // run page elements through step display conditionals again
    if(this.guideInstance){
      window.setTimeout(() => {
        this.guideInstance.start();
        console.log('%c page refresh ', 'background: #222; color: #bada55');
      }, 0);
    } else {
      console.warn('No active guideInstance');
    }
  }

  public showContent(contentID: string): void {
    // Forces specific Lusift content to appear for the current user by passing in the ID.
    if(!this.content || !this.contentSet) {
      return console.warn(`Content not set, pass valid content object to setContent()`);
    }
    // see if content exists for contentID
    if(!this.content[contentID]) {
      return console.warn(`Content with id of ${contentID} doesn't exist`);
    }
    if(this.guideInstance){
      this.guideInstance.close();
      // make sure the trackingState of the contentID is emptied
      this.guideInstance.clearTrackingState();
    }

    window.setTimeout(() => {
      // HACK:
      // There's a noticeable delay in react component appearing as bodyContent properties
      // on page load, so we arbitrarily wait 500ms before running this section
      this.activeGuideID = contentID;
      this.guideInstance = new Guide(contentID);
      this.guideInstance.start();
      this.prepareHooks();
    }, 500);
  }

  private prepareHooks(): void {
    // attach active content's navigation methods to Lusift instance
    this.next = this.guideInstance.nextStep.bind(this.guideInstance);
    this.prev = this.guideInstance.prevStep.bind(this.guideInstance);
    this.close = this.guideInstance.close.bind(this.guideInstance);
    this.goto = this.guideInstance.setStep.bind(this.guideInstance);

    const { onNext, onPrev, onClose } = this.content[this.activeGuideID].data;
    this.onNext = onNext;
    this.onPrev = onPrev;
    this.onClose = onClose;
  }
}

export default new Lusift();
