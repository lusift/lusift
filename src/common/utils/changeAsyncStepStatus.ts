import { window } from 'global';
import { loadState, saveState } from '../store';

const changeAsyncStepStatus = (stepIndex: number, toOpen: boolean): void => {
  const exisitingState = loadState();
  saveState({
    ...exisitingState,
    [window.Lusift.activeGuideID]: {
      ...exisitingState[window.Lusift.activeGuideID],
      trackingState: {
        ...exisitingState[window.Lusift.activeGuideID].trackingState,
        asyncSteps: {
          ...exisitingState[window.Lusift.activeGuideID].trackingState.asyncSteps,
          [stepIndex]: {
            toOpen
          }
        }
      }
    }
  });
}

export default changeAsyncStepStatus;
