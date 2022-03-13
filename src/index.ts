class Lusift {
    constructor(){
        console.log('Lusift imported');
    }
}

export default () => {
    // Lusift class receives all the guides as objects with id's
    // showContent() method is passed the id of the specific artifact to be started
    const lusiftInstance = new Lusift();
}
