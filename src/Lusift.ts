import Guide from './Guide';
import { saveState, loadState } from './localStorage';

export default class Lusift {
  private content;
  // We'll just pretend for now that there's only going to be 1 instance
  private guideInstance;

  constructor(content) {
    this.content=content;
    // if loadState() matches this.content
    //   sk
    // else
    //   saveState
    // saveState(this.content)
    // console.log(loadState());
  }

  refresh() {
    //equivalent of page()
    // run page elements through conditional again
    console.log('page refresh');
  }

  showContent(contentID: string) {
    //Forces specific Lusift content to appear for the current user by passing in the ID.
    const { type, data } = this.content[contentID];

    if (type==='guide') {
      this.guideInstance = new Guide(data);
      this.guideInstance.start();
    }
  }

  close() {
    //
  }
}


let printPrimeNumbers = (n) => {
  let i=3;
  while(n>0) {
    if(i%2!==0) {
      console.log(i);
      n--;
    }
    i++;
  }
}
