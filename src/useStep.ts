// We need to give the ability to modify html and css content
// - (btw, add a close button too - close x, dismiss link, none || skippable)
// - progress on click of: next button or target element
// Developer should be able to modify css on the global guide level, as well as on the step level
// Where should this stuff be stored at? Look at tippy
// How about a lusift.css file at the root?
// Add option for beacon in Tooltip
// Add developer helper method to quickly render an element on the screen
// Add animations
// Add asynchrous hotspots

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
