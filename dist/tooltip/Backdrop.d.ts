declare class Backdrop {
    private targetSelector;
    readonly stagedTargetClass: string;
    overlaySelectorClass: string;
    private data;
    private toStopOverlay;
    private resizeObservers;
    private focusTrap;
    constructor({ targetSelector, uid, guideID, index, data }: any);
    private resetBackdrop;
    private getDocumentDimensions;
    private addBackdop;
    private removeOverlay;
    remove(): void;
}
export default Backdrop;
