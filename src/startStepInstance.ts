import Tooltip from './Tooltip';
import Modal from './Modal';
import Hotspot from './Hotspot';

const startStepInstance = (stepData: any, guideID: string): void => {
  const { index, target, type, data } = stepData;
  let activeStepInstance: any;

  if (type==='tooltip') {
    const { actions, styleProps } = stepData;

    activeStepInstance = new Tooltip({
      target,
      data,
      index,
      guideID,
      actions,
      styleProps
    });
  } else if (type==='modal') {
    activeStepInstance = new Modal({
      index,
      guideID,
      data
    });

  } else if (type==='hotspot') {
    activeStepInstance = new Hotspot({
      data: stepData,
      guideID,
    });
    if(stepData.async) {
      activeStepInstance = null;
    }
  }
  return activeStepInstance;
}

export default startStepInstance;
