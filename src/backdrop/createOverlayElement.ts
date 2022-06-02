import { BACKDROP_Z_INDEX, OVERLAY_SELECTOR_CLASS } from '../common/constants';
import {
    getElementPosition,
    roundNum,
    getDocumentDimensions
} from "../common/utils/";

const areNumbersEqual = (num1: number, num2: number): boolean => {
    let num1Precision = num1.toString().substring(num1.toString().indexOf(".")).length - 1;
    if (num1.toString().indexOf(".") == -1) num1Precision = 0;

    let num2Precision = num2.toString().substring(num2.toString().indexOf(".")).length - 1;
    if (num2.toString().indexOf(".") == -1) num2Precision = 0;
    let decimalPlaces = Math.min(num1Precision, num2Precision);
    if (decimalPlaces > 2) {
        decimalPlaces = 1; //most reliable precision
    }
    /* log(num1, num2)
  log(num1Precision, num2Precision, decimalPlaces);

  log(roundNum(num1, decimalPlaces), roundNum(num2, decimalPlaces)); */

    return roundNum(num1, decimalPlaces) === roundNum(num2, decimalPlaces);
};


const createOverlayElement = ({ targetElement, stageGap, color, opacity }) => {

    const padding = stageGap;
    const div = () => document.createElement("div");
    const targetPosition = getElementPosition(targetElement);
    const { documentHeight, documentWidth } = getDocumentDimensions();

    const hTop = div();
    hTop.id = "hTop";
    const hBottom = div();
    hBottom.id = "hBottom";

    const vLeft = div();
    vLeft.id = "vLeft";
    const vRight = div();
    vRight.id = "vRight";

    const overlayStyle = {
        opacity,
        background: color,
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

    function shouldOverlayBeReset () {
        // See that the overlay isn't glitchy, reset if it is
        const { height: hTopHeight, width: hTopWidth } = getElementPosition(hTop);
        const { height: hBottomHeight } = getElementPosition(hBottom);
        const vLeftWidth = getElementPosition(vLeft).width;
        const vRightWidth = getElementPosition(vRight).width;

        const targetPosition = getElementPosition(targetElement);

        const overlaySumWidth = hTopWidth + vLeftWidth + vRightWidth;
        const overlaySumHeight = hTopHeight + hBottomHeight + targetPosition.height + 2 * padding;

        // detach it after getting overlay nodes measurements
        // and before taking measurements of the document
        detachOverlay();
        const { documentHeight, documentWidth } = getDocumentDimensions();
        attachOverlay();

        console.log(documentWidth, overlaySumWidth);
        console.log(documentHeight, overlaySumHeight);

        // NOTE: This check isn't precise enough sometimes, you can see the hair-thin lines
        // where these different overlay nodes meet
        if (
            !areNumbersEqual(documentWidth, overlaySumWidth) ||
            !areNumbersEqual(documentHeight, overlaySumHeight)
        ) {
            console.log('Reset backdrop');
            return true;
        } else {
            return false;
        }
    }

    function attachOverlay() {
        overlayNodes.forEach(el => document.body.appendChild(el));
    }
    function detachOverlay() {
        overlayNodes.forEach(el => document.body.removeChild(el));
    }
    function removeOverlay() {
        overlayNodes.forEach(el => el.remove());
    }

    return {
        nodes: overlayNodes,
        removeOverlay,
        detachOverlay,
        attachOverlay,
        shouldOverlayBeReset
    }
}

export default createOverlayElement;
