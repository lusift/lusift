import Tooltip from "../tooltip";
import Modal from "../modal";
import Hotspot from "../hotspot";

const startStepInstance = (stepData: any, guideID: string, onRemove: Function): void => {
    const { index, target, type, data, closeButton, styleProps, overlay } = stepData;
    let activeStepInstance: any;

    if (type === "tooltip") {
        const { actions, styleProps } = stepData;

        activeStepInstance = new Tooltip({
            target,
            data,
            index,
            guideID,
            actions,
            styleProps,
            onRemove
        });
    } else if (type === "modal") {
        activeStepInstance = new Modal({
            index,
            guideID,
            data,
            closeButton,
            onRemove,
            overlay,
            styleProps
        });
    } else if (type === "hotspot") {
        activeStepInstance = new Hotspot({
            data: stepData,
            guideID,
            onRemove
        });
    }
    return activeStepInstance;
};

export default startStepInstance;
