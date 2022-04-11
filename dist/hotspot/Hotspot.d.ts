import { Hotspot as HotspotData } from '../common/types';
declare class Hotspot {
    private tipID;
    private tippyInstance;
    private targetElement;
    readonly data: HotspotData;
    private beaconID;
    constructor({ data, guideID }: {
        data: any;
        guideID: any;
    });
    private addBeacon;
    private toggleTooltip;
    hideTooltip(): void;
    private changeAsyncStepStatus;
    private remove;
    private removeAndCloseAsync;
}
export default Hotspot;
