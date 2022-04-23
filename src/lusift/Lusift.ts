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
// TODO: try globalThis instead of global package
//
// TODO: decide on making configuring easier, with inheritence, global levels, etc.
// TODO: add support for angul*r
// TODO: Map out the lifecycle/flow of the entire library
// TODO: Test in csr/ssr react, angular, vue, vanilla
// TODO: Test in different browsers and OS'
// TODO: Clean up the messy implementation of Tooltip and Backdrop
// TODO: In case of customizing hotspot's beacon, we can just have a beaconElement property
// TODO: Check everywhere in the codebase we are using Object.assign and spread syntax
// BUG: Why is it that the element is hidden beneath the overlay sometimes
// --- what are the condition for these cases and how to solve them?
// TODO: Reference react-modal package
// NOTE: Handling versioning
// TODO: What if instead of jsx in lusift-react, I wanted to supply chakra-ui components?

class Lusift {
  private content: Content;
  private guideInstance: any;
  public render: Function;
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

  public getTrackingState(): TrackingState | null {
    if(this.activeGuideID) {
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
    if(!this.content) {
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
    let contentWithoutBodyContent = JSON.parse(JSON.stringify(this.content));

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
      } = contentWithoutBodyContent[key].data;

      // remove bodyContent from steps
      let stepsWithoutBodyContent = steps.map(step => {
        if(step.type==='tooltip' || step.type==='modal') {
          delete step.data.bodyContent;
        } else if (step.type==='hotspot') {
          delete step.tip.data.bodyContent;
        }
        return step;
      });

      contentWithoutBodyContent[key].data = {
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

    Object.keys(contentWithoutBodyContent).forEach((key) => {
      if(contentWithoutBodyContent[key].type==='guide'){
        const guideData = contentWithoutBodyContent[key].data; //prolly a guide
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
    // console.log('filtering')
    Object.keys(content).forEach((key) => {

      const {
        id,
        name='',
        description='',
        steps,
        onNext,
        onPrev,
        onClose,
        doNotResetTrackerOnContentChange=false
      } = content[key].data;

      this.content[key].data = {
        id,
        name,
        description,
        steps,
        onNext,
        onPrev,
        onClose,
        doNotResetTrackerOnContentChange
      };
    });

    let dataOfActiveGuideChanged: boolean;
    let contentIDExists: boolean;

    if (this.activeGuideID){
      dataOfActiveGuideChanged = this.hasGuideDataChanged(this.content[this.activeGuideID].data);
      contentIDExists = Object.keys(this.content).includes(this.activeGuideID);
    }

    // iterate through each content item to note changes and conditionally preserve trackingState
    // and then save to localStorage
    this.reconcileContentWithLocalState();
    //content has been set to local

    if(this.activeGuideID){
      // if the contentID doesn't exist at all in the new content received, or
      // if contentID exists but data has changed
      if(!contentIDExists || (contentIDExists && dataOfActiveGuideChanged)) {
        this.guideInstance.removeAllActiveSteps();
        this.activeGuideID=null;
        this.guideInstance=null;
      }
    }
  }

  public clearContent(): void {
    saveState({});
    this.content = {};
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
    if(!this.content) {
      return console.warn(`Content not set, pass valid content object to setContent()`);
    }
    // see if content exists for contentID
    if(!this.content[contentID]) {
      return console.warn(`Content with id of ${contentID} doesn't exist`);
    }
    if(this.activeGuideID === contentID){
      this.guideInstance.reRenderStepElements();
      return console.log(`${contentID} already active`);
    }
    if(this.guideInstance){
      // NOTE: Do we really want to clear trackingState too here though?
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
