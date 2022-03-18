
// This method exposes guide navigation methods to the steps
function useStep(guideIDsList: Array<string>) {
  // for this, don't accept guides without steps
  let index = -1;
  let guideID = guideIDsList[0];

  return {
    step(fn: Function) {
      index++;
      const stepData = fn(null, null, null);
      if (stepData.index < index) {
        // see if the index of incoming stepData is less or equal
        // moved to the next guide
        guideID = guideIDsList[guideIDsList.indexOf(guideID)+1];
        // TODO what if it's undefined
      }
      const nextStep = `window.localStorage.lusift_step_methods[${guideID}].nextStep`;
      const prevStep = `window.localStorage.lusift_step_methods[${guideID}].prevStep`;
      const close = `window.localStorage.lusift_step_methods[${guideID}].close`;
      console.log(fn(nextStep, prevStep, close))
      return fn(nextStep, prevStep, close);
    }
  }
}

export default useStep;
