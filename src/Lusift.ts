import Guide from './Guide';
import { saveState, loadState } from './localStorage';

export default class Lusift {
  private content;
  // We'll just pretend for now that there's only going to be 1 instance
  private guideInstances;

  constructor(content) {
    this.content=content;
    this.guideInstances = {};
    // if loadState() type is not object,
    if(!(this.content instanceof Object) || this.content.constructor !== Object ) {
      saveState({});
    }
  }

  refresh() {
    // run page elements through conditional again
    this.guideInstances.forEach(gi => gi.attemptShow())
    console.log('page refresh');
  }

  showContent(contentID: string) {
    //Forces specific Lusift content to appear for the current user by passing in the ID.
    const { type, data } = this.content[contentID];

    if (type==='guide') {
      const guideInstance = new Guide(data);
      this.guideInstances[contentID] = guideInstance;
      guideInstance.start();
    }
    console.log(this.guideInstances)
  }

  close(contentID: string) {
    //
  }
}
