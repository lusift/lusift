import { loadState, saveState } from '../localStorage';
import { window } from 'global';

const changeAsyncStepStatus = (stepIndex: number, toOpen: boolean): void => {
  const exisitingState = loadState();
  saveState({
    ...exisitingState,
    [window.Lusift.activeGuideID]: {
      ...exisitingState[window.Lusift.activeGuideID],
      trackingState: {
        ...exisitingState[window.Lusift.activeGuideID].trackingState,
        asyncSteps: {
          ...exisitingState[window.Lusift.activeGuideID].asyncSteps,
          [stepIndex]: {
            toOpen
          }
        }
      }
    }
  });
}

export default changeAsyncStepStatus;
