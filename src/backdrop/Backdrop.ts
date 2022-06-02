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
import createOverlayElement from './createOverlayElement';

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
    private data: BackdropData = {
        stageGap: 5,
        opacity: "0.5",
        color: "#444",
    };
    private toStopOverlay: boolean = false;
    private focusTrap: any;
    private removeOverlay: () => void = () => {};

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

    // TODO: refactor this method
    // -- backdrop content data isn't being applied here
    private createOverlay(): void {
        const targetElement = document.querySelector(this.targetSelector);
        const padding = this.data.stageGap;

        const { documentHeight, documentWidth } = getDocumentDimensions();

        const targetPosition = getElementPosition(targetElement);

        const { nodes: overlayNodes, removeOverlay } = createOverlayElement({
            targetPosition,
            stageGap: this.data.stageGap,
            documentHeight,
            documentWidth
        });
        overlayNodes.forEach(el => document.body.appendChild(el));
        this.removeOverlay = removeOverlay;
        const [hTop, hBottom, vLeft, vRight] = overlayNodes;

        // See that the overlay isn't glitchy, reset if it is
        const { height: hTopHeight, width: hTopWidth } = getElementPosition(hTop);
        const { height: hBottomHeight } = getElementPosition(hBottom);
        const vLeftWidth = getElementPosition(vLeft).width;
        const vRightWidth = getElementPosition(vRight).width;

        const overlaySumWidth = hTopWidth + vLeftWidth + vRightWidth;
        const overlaySumHeight = hTopHeight + hBottomHeight + targetPosition.height + 2 * padding;

        log(documentWidth, overlaySumWidth);
        log(documentHeight, overlaySumHeight);

        if (
            !areNumbersEqual(documentWidth, overlaySumWidth) ||
            !areNumbersEqual(documentHeight, overlaySumHeight)
        ) {
            console.log('reset backdrop')
            this.resetBackdrop();
        }
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
