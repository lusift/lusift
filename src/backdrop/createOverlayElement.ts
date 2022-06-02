import { BACKDROP_Z_INDEX, OVERLAY_SELECTOR_CLASS } from '../common/constants';


const createOverlayElement = ({ targetPosition, stageGap, documentHeight, documentWidth }) => {

    const padding = stageGap;
    const div = () => document.createElement("div");

    const hTop = div();
    hTop.id = "hTop";
    const hBottom = div();
    hBottom.id = "hBottom";

    const vLeft = div();
    vLeft.id = "vLeft";
    const vRight = div();
    vRight.id = "vRight";

    const overlayStyle = {
        opacity: "0.5",
        background: "#444",
        transition: "visibility 0.3s ease-in-out",
        position: "absolute",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
        zIndex: BACKDROP_Z_INDEX,
        border: "1px solid transparent",
    };

    Object.assign(hTop.style, {
        ...overlayStyle,
        height: `${targetPosition.bottom - targetPosition.height - padding}px`,
        width: `${targetPosition.right - targetPosition.left + 2 * padding}px`,
        left: `${targetPosition.left - padding}px`,
        bottom: `${targetPosition.top - padding}px`,
    });

    Object.assign(hBottom.style, {
        ...overlayStyle,
        height: `${documentHeight - (targetPosition.top + targetPosition.height + padding)}px`,
        width: `${targetPosition.right - targetPosition.left + 2 * padding}px`,
        left: `${targetPosition.left - padding}px`,
        top: `${targetPosition.bottom + padding}px`,
    });

    Object.assign(vLeft.style, {
        ...overlayStyle,
        width: `${targetPosition.left - padding}px`,
        height: `${documentHeight}px`,
        right: `${targetPosition.left - padding}px`,
    });

    Object.assign(vRight.style, {
        ...overlayStyle,
        width: `${documentWidth - (targetPosition.left + targetPosition.width) - padding}px`,
        height: `${documentHeight}px`,
        left: `${targetPosition.right + padding}px`,
    });
    const overlayNodes = [hTop, hBottom, vLeft, vRight].map(el => {
        el.classList.add(OVERLAY_SELECTOR_CLASS);
        return el;
    });

    return {
        nodes: overlayNodes,
        removeOverlay: () => {
            overlayNodes.forEach(el => el.remove());
        }
    }
}

export default createOverlayElement;
