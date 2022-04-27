import { BackdropData } from '../common/types';
declare class Backdrop {
    private targetSelector;
    private timers;
    readonly stagedTargetClass: string;
    readonly overlaySelectorClass: string;
    private data;
    private toStopOverlay;
    private resizeObservers;
    private focusTrap;
    constructor({ targetSelector, guideID, index, data }: {
        targetSelector: string;
        index: number;
        guideID: string;
        data: BackdropData;
    });
    private resetBackdrop;
    private getDocumentDimensions;
    private createOverlay;
    private removeOverlay;
    remove(): void;
}
export default Backdrop;
