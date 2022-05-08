import { document, window } from "global";
import createHotspotTooltip from "./createHotspotTooltip";
import { createBeaconElement, positionBeacon } from "./beacon-element";
import {
    getElementPosition,
    getStepUID,
    changeAsyncStepStatus,
    onElementResize,
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
    private resizeObservers: any[] = [];

    constructor({ data, guideID }) {
        log(data);
        this.data = data;
        const { index, type, target } = data;
        this.tipID = getStepUID({ guideID, type, index });
        this.beaconID = getStepUID({
            guideID,
            type: "beacon",
            index,
        });
        this.targetElement = document.querySelector(target.elementSelector);
        this.addBeacon();

        // reposition beacon on body and targetElement resize
        /* this.resizeObservers.push(onElementResize(document.body, this.repositionBeacon.bind(this)));
        this.resizeObservers.push(
            onElementResize(this.targetElement, this.repositionBeacon.bind(this)),
        ); */
    }

    private repositionBeacon(): void {
        this.remove();
        this.fuitInstance = null;
        this.addBeacon();
        log("reset beacon position");
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
        log('updated beacon position');
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
        window.ub = this.updateBeaconPosition.bind(this);
    }

    private async toggleTooltip() {
        // log('toggle tooltip');

        const target = document.getElementById(this.beaconID);
        const { data, styleProps } = this.data.tip;
        const activeHotspot = window.Lusift.activeHotspot;
        const Lusift = window["Lusift"];

        if (activeHotspot && this.data.index !== activeHotspot.data.index) {
            Lusift.activeHotspot.hideTooltip();
        }

        // do not allow async step to close in dev mode
        const isDevMode = !Boolean(Lusift.activeGuide);
        let removeMethod = isDevMode ? Lusift.close : this.removeAndCloseAsync.bind(this);

        if (!this.fuitInstance) {
            // if it was never initiated
            this.fuitInstance = await createHotspotTooltip({
                remove: removeMethod,
                uid: this.tipID,
                index: this.data.index,
                target: target,
                styleProps,
                showOnCreate: false,
                data,
                onClickOutside: (instance, event) => {
                    log('clicked outside');
                    // TODO: only when it's not hidden
                    console.log(event);
                    // removeMethod();
                }
            });
            Lusift.activeHotspot = this;
        } else if (this.fuitInstance.getState().isRemoved) {
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

    private remove(): void {
        log(`Removing id: ${this.data.index} hotspot`);
        if (this.fuitInstance) {
            if (this.fuitInstance.getState().isRemoved) {
                log("Hotspot's tooltip is already destroyed");
            }
            this.fuitInstance.remove();
        } else {
            log("Hotspot closed without ever opening");
        }
        const beaconElement = document.getElementById(this.beaconID);
        if (beaconElement) {
            beaconElement.parentElement.remove();
            window.Lusift.activeHotspot = null;
        }
    }

    private removeResizeObservers(): void {
        this.resizeObservers.forEach(ro => ro.disconnect());
    }

    private removeAndCloseAsync(): void {
        this.remove();
        this.changeAsyncStepStatus(false);
        this.removeResizeObservers();
    }
}

export default Hotspot;
