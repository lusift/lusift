import { document, window } from "global";
import createHotspotTooltip from "./createHotspotTooltip";
import { createBeaconElement, positionBeacon } from "./beacon-element";
import { autoUpdate } from '@floating-ui/dom';
import {
    getElementPosition,
    getStepUID,
    changeAsyncStepStatus,
    debounce
} from "../common/utils";
import { Hotspot as HotspotData } from "../common/types";
import { log, warn, error } from "../common/logger";

// TODO_: In case of customizing hotspot's beacon, we can just have a beaconElement property
// TODO: Should the beacon animation stop when tip is open?

class Hotspot {
    private tipID: string;
    private fuitInstance: any;
    private targetElement: HTMLElement;
    readonly data: HotspotData;
    private beaconID: string;
    private beaconAutoUpdateCleanup!: Function;
    private onRemove: Function;

    constructor({ data, guideID, onRemove }) {
        log(data);
        this.data = data;
        this.onRemove = onRemove;
        const { index, type, target } = data;
        this.tipID = getStepUID({ guideID, type, index });
        this.beaconID = getStepUID({
            guideID,
            type: "beacon",
            index,
        });
        this.targetElement = document.querySelector(target.elementSelector);
        this.addBeacon();
        this.createTip();
    }

    private updateBeaconPosition() : void {
        let {
            top: targetTop,
            left: targetLeft,
            width: targetWidth,
            height: targetHeight,
        } = getElementPosition(this.targetElement);
        const targetPosition = {
            targetTop,
            targetLeft,
            targetWidth,
            targetHeight,
        };
        const beaconData = this.data.beacon;

        const beaconElement = document.getElementById(this.beaconID);
        positionBeacon(beaconElement, targetPosition, beaconData.placement);
    }

    private addBeacon(): void {
        log("adding beacon");

        const beaconData = this.data.beacon;

        createBeaconElement({
            beaconData,
            beaconID: this.beaconID,
            toggleTooltip: this.toggleTooltip.bind(this),
        });
        this.updateBeaconPosition();
    }

    private async createTip() {
        const Lusift = window["Lusift"];
        const target = document.getElementById(`${this.beaconID}`);
        const { data, styleProps } = this.data.tip;
        const isDevMode = !Boolean(Lusift.activeGuide);

        // do not allow async step to close in dev mode
        const removeMethod = isDevMode ? Lusift.close : this.removeAndCloseAsync.bind(this);

        this.fuitInstance = await createHotspotTooltip({
            remove: removeMethod,
            uid: this.tipID,
            index: this.data.index,
            target: target,
            styleProps,
            showOnCreate: false,
            data,
            onClickOutside: (instance, event) => {
                removeMethod();
            }
        });

        // reposition beacon on body and targetElement resize

        const updateBeaconPosition = this.updateBeaconPosition.bind(this);

        const debouncedUpdateBeaconPosition = debounce((_x?) => {
            updateBeaconPosition();
        }, 100);

        this.beaconAutoUpdateCleanup = autoUpdate(
            this.targetElement,
            this.fuitInstance.tooltipElement,
            () => {
                debouncedUpdateBeaconPosition(undefined);
            },
            {
                ancestorScroll: false,
                ancestorResize: true,
                elementResize: true
            });
    }

    private async toggleTooltip() {
        // log('toggle tooltip');

        const activeHotspot = window.Lusift.activeHotspot;
        const Lusift = window["Lusift"];

        if (activeHotspot && this.data.index !== activeHotspot.data.index) {
            // hide any other potentially active hotspot tip
            Lusift.activeHotspot.hideTooltip();
        }

        if (this.fuitInstance.getState().isRemoved) {
            error("Uh... but it doesn't exist. unexpected");
            // if it's removed
        } else if (this.fuitInstance.getState().isShown) {
            await this.hideTooltip();
        } else if (this.fuitInstance) {
            // if it's hidden
            await this.fuitInstance.show();
            Lusift.activeHotspot = this;
        }
    }

    // TODO: refactor names, here it could be hideTip()
    public async hideTooltip() {
        await this.fuitInstance.hide();
        window.Lusift.activeHotspot = null;
    }

    private changeAsyncStepStatus(toOpen: boolean): void {
        if (!this.data.async) return;
        changeAsyncStepStatus(this.data.index, toOpen);
    }

    private async remove() {
        log(`Removing id: ${this.data.index} hotspot`);

        if (this.fuitInstance) {
            if (this.fuitInstance.getState().isShown) {
                await this.hideTooltip();
            }
            if (this.fuitInstance.getState().isRemoved) {
                log("Hotspot's tooltip is already destroyed");
            } else {
                this.fuitInstance.remove();
            }
        } else {
            log("Hotspot closed without ever opening");
        }
        const beaconElement = document.getElementById(this.beaconID);
        if (beaconElement) {
            beaconElement.parentElement.remove();
        }
    }

    private removeResizeObservers(): void {
        this.beaconAutoUpdateCleanup();
    }

    private removeAndCloseAsync(): void {
        this.remove();
        this.changeAsyncStepStatus(false);
        this.removeResizeObservers();
        this.onRemove();
    }
}

export default Hotspot;
