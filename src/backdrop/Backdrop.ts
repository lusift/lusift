import { document, window } from "global";
import {
    getStepUID,
    addFocusTrap,
    copyObject,
    hasFocussableElements
} from "../common/utils/";
import { log, warn, error } from "../common/logger";
import { BackdropData } from "../common/types";
import createOverlayElement from './createOverlayElement';

const getElement = (elementSelector: string): Element => document.querySelector(elementSelector);

class Backdrop {
    private targetSelector: string;
    readonly stagedTargetClass: string;
    private data: BackdropData;
    private toStopOverlay: boolean = false;
    private focusTrap: any;
    public removeOverlay: () => void = () => {};
    // public shouldOverlayBeReset!: () => boolean;

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

        this.data = copyObject(data);
        this.targetSelector = targetSelector;

        this.createOverlay();

        const target = [".lusift > .tooltip", this.targetSelector];

        const toEnableFocusTrap = hasFocussableElements(getElement(target[0])) ||
            hasFocussableElements(getElement(target[1]));

        // trap focus inside tooltip
        if (toEnableFocusTrap) {
            this.focusTrap = addFocusTrap({
                target
            });
        }
    }

    public resetBackdrop(): void {
        // HACK: intervene in the event backdrop has already been closed and there's a rogue timeout: rare
        if (this.toStopOverlay) return error(`Lusift: This overlay instance should be removed`);
        this.removeOverlay();
        this.createOverlay();
    }

    private createOverlay(): void {
        const targetElement = getElement(this.targetSelector);
        const { color, opacity } = this.data;

        const {
            nodes: overlayNodes,
            removeOverlay,
            attachOverlay,
            shouldOverlayBeReset
        } = createOverlayElement({
            targetElement,
            stageGap: this.data.stageGap,
            color,
            opacity
        });
        attachOverlay();
        shouldOverlayBeReset();
        this.removeOverlay = removeOverlay;
        // this.shouldOverlayBeReset = shouldOverlayBeReset;
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
