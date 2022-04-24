import { window } from 'global';
import { loadState, saveState } from '../store';

const changeAsyncStepStatus = (stepIndex: number, toOpen: boolean): void => {

  const exisitingState = loadState();
  const { id: activeGuideID } = window.Lusift.activeGuide;
  saveState({
    ...exisitingState,
    [activeGuideID]: {
      ...exisitingState[activeGuideID],
      trackingState: {
        ...exisitingState[activeGuideID].trackingState,
        asyncSteps: {
          ...exisitingState[activeGuideID].trackingState.asyncSteps,
          [stepIndex]: {
            toOpen
          }
        }
      }
    }
  });
}

export default changeAsyncStepStatus;
