import { Hotspot as HotspotData } from "../common/types";
declare class Hotspot {
    private tipID;
    private fuitInstance;
    private targetElement;
    readonly data: HotspotData;
    private beaconID;
    private beaconAutoUpdateCleanup;
    private onRemove;
    constructor({ data, guideID, onRemove }: {
        data: any;
        guideID: any;
        onRemove: any;
    });
    private updateBeaconPosition;
    private addBeacon;
    private createTip;
    private toggleTooltip;
    hideTooltip(): Promise<void>;
    private changeAsyncStepStatus;
    private remove;
    private removeResizeObservers;
    private removeAndCloseAsync;
}
export default Hotspot;
