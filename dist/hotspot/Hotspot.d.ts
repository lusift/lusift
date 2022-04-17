import { Hotspot as HotspotData } from '../common/types';
declare class Hotspot {
    private tipID;
    private tippyInstance;
    private targetElement;
    readonly data: HotspotData;
    private beaconID;
    private resizeObservers;
    constructor({ data, guideID }: {
        data: any;
        guideID: any;
    });
    private repositionBeacon;
    private addBeacon;
    private toggleTooltip;
    hideTooltip(): void;
    private changeAsyncStepStatus;
    private remove;
    private removeResizeObservers;
    private removeAndCloseAsync;
}
export default Hotspot;
