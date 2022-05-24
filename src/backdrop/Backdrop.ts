import { document, window } from "global";
import {
    styleObjectToString,
    getStepUID,
    getElementPosition,
    roundNum,
    addFocusTrap,
    getScrollBarWidth,
    getDocumentDimensions,
} from "../common/utils/";
import { log, warn, error } from "../common/logger";
import { BackdropData } from "../common/types";
import { BACKDROP_Z_INDEX } from '../common/constants';

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

Object["fromEntries"] = arr => Object.assign({}, ...arr.map(([k, v]) => ({ [k]: v })));
const getDefinedProps = obj =>
    Object["fromEntries"](Object.entries(obj).filter(([k, v]) => v !== undefined));

class Backdrop {
    private targetSelector: string;
    readonly stagedTargetClass: string;
    readonly overlaySelectorClass: string = "lusift-backdrop-overlay";
    private data: BackdropData = {
        stageGap: 5,
        opacity: "0.5",
        color: "#444",
    };
    private toStopOverlay: boolean = false;
    private focusTrap: any;

    constructor({
        targetSelector,
        guideID,
        index,
        data,
    }: {
        targetSelector: string;
        index: number;
        guideID: string;
        data: any;
    }) {
        const uid = getStepUID({ guideID, index, type: "backdrop" });
        this.stagedTargetClass = `${uid}__target`;

        this.data = Object.assign({}, this.data, getDefinedProps(data));
        this.targetSelector = targetSelector;

        this.createOverlay();

        // trap focus inside tooltip
        this.focusTrap = addFocusTrap({
            target: [".lusift > .tooltip", this.targetSelector],
        });
    }

    public resetBackdrop(): void {
        // HACK: intervene in the event backdrop has already been closed and there's a rogue timeout: rare
        if (this.toStopOverlay) return error(`Lusift: This overlay instance should be removed`);
        this.removeOverlay();
        this.createOverlay();
    }

    private createOverlay(): void {
        /* document.documentElement.style.overflow = 'hidden';
           document.body.scroll = "no"; */
        const targetElement = document.querySelector(this.targetSelector);
        const padding = this.data.stageGap;

        const { documentHeight, documentWidth } = getDocumentDimensions();

        const targetPosition = getElementPosition(targetElement);

        const hTop = document.createElement("div");
        hTop.id = "hTop";
        const hBottom = document.createElement("div");
        hBottom.id = "hBottom";

        const vLeft = document.createElement("div");
        vLeft.id = "vLeft";
        const vRight = document.createElement("div");
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

        hTop.style.cssText = styleObjectToString({
            ...overlayStyle,
            height: `${targetPosition.bottom - targetPosition.height - padding}px`,
            width: `${targetPosition.right - targetPosition.left + 2 * padding}px`,
            left: `${targetPosition.left - padding}px`,
            bottom: `${targetPosition.top - padding}px`,
        });

        hBottom.style.cssText = styleObjectToString({
            ...overlayStyle,
            height: `${documentHeight - (targetPosition.top + targetPosition.height + padding)}px`,
            width: `${targetPosition.right - targetPosition.left + 2 * padding}px`,
            left: `${targetPosition.left - padding}px`,
            top: `${targetPosition.bottom + padding}px`,
        });

        vLeft.style.cssText = styleObjectToString({
            ...overlayStyle,
            width: `${targetPosition.left - padding}px`,
            height: `${documentHeight}px`,
            right: `${targetPosition.left - padding}px`,
        });

        vRight.style.cssText = styleObjectToString({
            ...overlayStyle,
            width: `${documentWidth - (targetPosition.left + targetPosition.width) - padding}px`,
            height: `${documentHeight}px`,
            left: `${targetPosition.right + padding}px`,
        });

        [hTop, hBottom, vLeft, vRight].forEach(el => {
            el.classList.add(this.overlaySelectorClass);
            document.body.appendChild(el);
        });
        targetElement.classList.add(this.stagedTargetClass);

        // See that the overlay isn't glitchy, reset if it is
        const { height: hTopHeight, width: hTopWidth } = getElementPosition(hTop);
        const { height: hBottomHeight } = getElementPosition(hBottom);
        const vLeftWidth = getElementPosition(vLeft).width;
        const vRightWidth = getElementPosition(vRight).width;

        const overlaySumWidth = hTopWidth + vLeftWidth + vRightWidth;
        const overlaySumHeight = hTopHeight + hBottomHeight + targetPosition.height + 2 * padding;

        /* log(screenWidth, overlaySumWidth);
           log(screenHeight, overlaySumHeight); */

        if (
            !areNumbersEqual(documentWidth, overlaySumWidth) ||
            !areNumbersEqual(documentHeight, overlaySumHeight)
        ) {
            this.resetBackdrop();
        }
    }

    private removeOverlay(): void {
        document.querySelectorAll(`.${this.overlaySelectorClass}`).forEach((el: HTMLElement) => {
            if (el) el.remove();
        });

        const targetElement = document.querySelector(this.targetSelector);
        if (targetElement) targetElement.classList.remove(this.stagedTargetClass);
    }

    public remove(): void {
        // log('removing Backdrop');
        // remove event listeners
        this.toStopOverlay = true;
        if (this.focusTrap) {
            this.focusTrap.deactivate();
        }
        this.removeOverlay();
    }
}

export default Backdrop;
