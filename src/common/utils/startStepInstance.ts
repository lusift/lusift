import Tooltip from '../../tooltip';
import Modal from '../../modal';
import Hotspot from '../../hotspot';

const startStepInstance = (stepData: any, guideID: string): void => {
  const { index, target, type, data, closeButton } = stepData;
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
      data,
      closeButton
    });

  } else if (type==='hotspot') {
    activeStepInstance = new Hotspot({
      data: stepData,
      guideID,
    });
  }
  return activeStepInstance;
}

export default startStepInstance;
