import Guide from './Guide';
import { saveState, loadState } from './localStorage';
import { window } from 'global';

import { Content } from './types';
import { isOfTypeContent } from './utils/isOfType';

export default class Lusift {
  private content: Content;
  // We'll just pretend for now that there's only going to be 1 instance
  private guideInstances: any;

  constructor() {
    this.guideInstances = {};
    console.log('Lusift imported');
    /* setTimeout(() => {
      window.Lusift = this;
    }, 0); */
  }

  setContent(content: Content) {
    // TODO filter and validate this.content
    console.log('validating content: ');
    console.log(content)
    if(!isOfTypeContent(content)) {
      return console.warn('Content data type is invalid');
    }
    this.content = content;
    console.log('filtering')
    Object.values(this.content).forEach(item => {
      console.log(item);
    })

    /* this.content = Object.values(content.data).forEach(data => {
      delete data.finished;
      delete data.prematurelyClosed;
      delete data.activeStep;
      return data;
    }); */
    console.log('content set:');
    console.log(loadState());
    const localData = loadState();
    // if loadState() type is not object,
    if(!(localData instanceof Object) || localData.constructor !== Object) {
      console.log('saving state as object');
      saveState({});
    }
  }

  refresh() {
    // run page elements through conditional again
    Object.values(this.guideInstances).forEach((gi: Guide) => gi.attemptShow());
    console.log('page refresh');
  }

  showContent(contentID: string) {
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
  }

  close(contentID: string) {
    //
  }
}
