import Guide from './Guide';
import guide1 from './guide1';

class Lusift {
    private content;
    constructor(content){
        console.log('Lusift imported');
        this.content = content;
    }
    showContent(contentID: string) {
        //Forces specific Lusift content to appear for the current user by passing in the ID.
        // we can have a targeting class later that'll deal with user targetting
        const guideData = this.content[contentID];
        const gi = new Guide(guideData);
        gi.start();
    }
}

const content = {
    "guide1": guide1
}

export default () => {
    // Lusift class receives all the guides as objects with id's
    // showContent() method is passed the id of the specific artifact to be started
    const lusiftInstance = new Lusift(content);
    lusiftInstance.showContent("guide1");
}
