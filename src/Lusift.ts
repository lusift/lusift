import Guide from './Guide';
import { saveState, loadState } from './localStorage';

export default class Lusift {
  private content;
  // We'll just pretend for now that there's only going to be 1 instance
  private guideInstances;

  constructor() {
    this.guideInstances = {};
    console.log('Lusift imported');
  }

  setContent(content) {
    // TODO filter and validate this.content
    this.content=content;
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
    this.guideInstances.forEach(gi => gi.attemptShow());
    console.log('page refresh');
  }

  showContent(contentID: string) {
    //Forces specific Lusift content to appear for the current user by passing in the ID.
    // TODO see if content exists for ID
    setTimeout(() => {
      const { type, data } = this.content[contentID];

      if (type==='guide') {
        console.log('sending guide data:');
        const guideInstance = new Guide(data);
        this.guideInstances[contentID] = guideInstance;
        guideInstance.start();
      }
      console.log(this.guideInstances)

    }, 1000);
  }

  close(contentID: string) {
    //
  }
}
