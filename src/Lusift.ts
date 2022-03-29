import Guide from './Guide';
import { saveState, loadState } from './localStorage';
import { GuideType } from './types';
import isEqual from 'lodash.isequal';

import { window, document } from 'global';

import { Content } from './types';
import { isOfTypeContent, isObject } from './utils/isOfType';
import addTippyCSS from './addTippyCSS';

// TODO add a dev class
// TODO add constants file
// TODO q- can you have multiple flows at once? No right?!
// TODO give ability to run functions after each step and guide

export default new class Lusift {
  private content: Content;
  private guideInstance: any;
  private contentSet: boolean;

  private next: Function;
  private prev: Function;
  private close: Function;
  private goto: Function;

  constructor() {
    console.log('%c Lusift constructor! ', 'background: #222; color: #bada55');

    const localData = loadState();
    // if loadState() type is not object,
    if(!isObject(localData)) {
      // console.log('saving state as object');
      saveState({});
    }
    addTippyCSS();

    if (typeof window !== "undefined") {
      window.setTimeout(() => {
      }, 2000);
    }
  }

  private hasGuideDataChanged(guideData: GuideType): boolean {
    const localData = loadState();
    if(!localData[guideData.id]) return true;
    const localGuideData = localData[guideData.id];
    delete localGuideData.trackingState;
    return !isEqual(localGuideData, guideData);
  }

  private reconcileContentWithLocalState(): void {
    // Look through each content item,
    // --clear tracking data if item data has changed
    // --conserve otherwise
    let stateToSave = {};

    Object.keys(this.content).forEach((key) => {
      if(this.content[key].type==='guide'){
        const guideData = this.content[key].data; //prolly a guide
        if(this.hasGuideDataChanged(guideData)) {
          console.log(`${key} changed`);
          // clear tracking data
          stateToSave[guideData.id] = guideData;
        } else {
          console.log(`${key} is unchanged`);
          const localGuideData = loadState()[guideData.id];
          stateToSave[guideData.id] = localGuideData;
        }
      }
    });
    saveState(stateToSave);
  }

  private setContent(content: Content): void {
    // filter and validate this.content
    /* console.log('validating content: ');
       console.log(content) */
    if(!isOfTypeContent(content)) {
      return console.warn('Content data type is invalid');
    }
    this.content = content;
    this.contentSet = true;
    // console.log('filtering')
    Object.keys(this.content).forEach((key) => {
      const { id, name, description, steps } = this.content[key].data; //prolly a guide
      this.content[key].data = { id, name, description, steps };
    });

    // iterate through each content item to note changes and conditionally preserve trackingState
    // and then save to localStorage
    this.reconcileContentWithLocalState();

    // console.log('content set to local:');
    const localData = loadState();
    // console.log(localData);
  }

  private refresh(): void {
    // run page elements through conditional again
    if(this.guideInstance){
      window.setTimeout(() => {
        this.guideInstance.attemptShow();
        console.log('%c page refresh ', 'background: #222; color: #bada55');
      }, 0);
    } else {
      console.warn('No active guideInstance');
    }
  }

  private showContent(contentID: string): void {
    //Forces specific Lusift content to appear for the current user by passing in the ID.
    if(!this.content || !this.contentSet) {
      return console.warn(`Content not set, pass valid content object to setContent()`);
    }
    // see if content exists for ID
    if(!this.content[contentID]) {
      return console.warn(`Content with id of ${contentID} doesn't exist`);
    }
    if(this.guideInstance){
      this.guideInstance.close();
      // make sure the trackingState of the contentID is empty
      this.guideInstance.clearTrackingState();
    }

    setTimeout(() => {
      // console.log('sending guide data:');
      this.guideInstance = new Guide(contentID);
      this.guideInstance.start();
      this.prepareHooks();
    }, 0);
  }

  private prepareHooks(): void {
    // attatch active content's navigation methods to Lusift instance
    this.next = this.guideInstance.nextStep.bind(this.guideInstance);
    this.prev = this.guideInstance.prevStep.bind(this.guideInstance);
    this.close = this.guideInstance.close.bind(this.guideInstance);
    this.goto = this.guideInstance.setStep.bind(this.guideInstance);
  }
}();
