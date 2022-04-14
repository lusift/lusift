declare class Backdrop {
    private targetSelector;
    readonly stagedTargetClass: string;
    overlaySelectorClass: string;
    private data;
    private dummyElement;
    private toStopOverlay;
    private resizeObservers;
    private focusTrap;
    constructor({ targetSelector, uid, guideID, index, data }: any);
    private resetBackdrop;
    private getScreenDimensions;
    private addBackdop;
    private removeOverlay;
    remove(): void;
}
export default Backdrop;
