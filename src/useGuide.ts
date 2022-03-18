import Tooltip from './Tooltip';
import Guide from './Guide';

function useGuide({ guideID }: { guideID: string }) {
  // create Guide here and attach it to Lusift, modify attemptShow to show that
  let index = -1;
  // TODO but Lusift class hasn't been initiated yet
  // What we should do is - scrape all of this crap
  // - insert dummy next, close, prev methods
  // - update those methods in their place with real ones inside Guide
  const { nextStep, prevStep, close } = new Guide(guideID);

  return {
    tooltip(fn: Function) {
      index++;
      // initiate Tooltip
      const tooltipData = fn(nextStep, prevStep, close);
      const { target, data } = tooltipData;
      const tooltipInstance = new Tooltip({
        target,
        data,
        index,
        guideID,
        nextStep,
        prevStep,
        closeGuide: close
      });
      console.log(tooltipInstance)
      return tooltipInstance;
      return tooltipData;
    },
    modal() {
      index++;

    },
    getGuideID() {
      return console.log(guideID);
    }
  }
}

export default useGuide;
