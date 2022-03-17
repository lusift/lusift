import Guide from './Guide';
import { saveState, loadState } from './localStorage';
import { window } from 'global';
import isEqual from 'lodash.isequal';

import { Content } from './types';
import { isOfTypeContent } from './utils/isOfType';

export default class Lusift {
  private content: Content;
  private guideInstances: any;

  constructor() {
    this.guideInstances = {};
    console.log('Lusift imported');
    const localData = loadState();
    // if loadState() type is not object,
    if(!(localData instanceof Object) || localData.constructor !== Object) {
      console.log('saving state as object');
      saveState({});
    }
  }

  private hasGuideDataChanged(guideData): boolean {
    console.log('checking if guide data has changed');
    const localData = loadState();
    console.log(localData);
    if(!localData[guideData.id]) return true;
    const localGuideData = localData[guideData.id];
    delete localGuideData.trackingState;
    return !isEqual(localGuideData, guideData);
  }

  private reconcileContentWithState(): void {
    // Look through each content item,
    // --clear tracking data if main data has changed
    // --conserve otherwise
    // TODO format tracking data in guide differently and then commit that change first
    Object.keys(this.content).forEach((key) => {
      if(this.content[key].type==='guide'){
        const guideData = this.content[key].data; //prolly a guide
        if(this.hasGuideDataChanged(guideData)) {
          // clear tracking data
        } else {

        }
      }
    });
  }

  public setContent(content: Content): void {
    // filter and validate this.content
    // TODO where are we saving this.content to local state
    console.log('validating content: ');
    console.log(content)
    if(!isOfTypeContent(content)) {
      return console.warn('Content data type is invalid');
    }
    this.content = content;
    console.log('filtering')
    Object.keys(this.content).forEach((key) => {
      const { id, name, description, steps } = this.content[key].data; //prolly a guide
      this.content[key].data = { id, name, description, steps };
    });

    console.log('content set:');
    const localData = loadState();
    console.log(localData);
  }


  public refresh(): void {
    // run page elements through conditional again
    Object.values(this.guideInstances).forEach((gi: Guide) => gi.attemptShow());
    console.log('page refresh');
  }

  showContent(contentID: string): void {
    //Forces specific Lusift content to appear for the current user by passing in the ID.
    if(!this.content) {
      return console.warn(`Content not set, pass valid content object to setContent()`);
    }

    // see if content exists for ID
    if(!this.content[contentID]) {
      return console.warn(`Content with id of ${contentID} doesn't exist`);
    }
    setTimeout(() => {
      const { type, data } = this.content[contentID];

      if (type==='guide') {
        console.log('sending guide data:');
        const guideInstance = new Guide(data);
        this.guideInstances[contentID] = guideInstance;
        guideInstance.start();
      }
      console.log(this.guideInstances)

    }, 0);
    // TODO return all relevant hooks
  }

  close(contentID: string) {
    //
  }
}
