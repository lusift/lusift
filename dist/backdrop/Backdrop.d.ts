declare class Backdrop {
    private targetSelector;
    readonly stagedTargetClass: string;
    private data;
    private toStopOverlay;
    private focusTrap;
    removeOverlay: () => void;
    constructor({ targetSelector, guideID, index, data, }: {
        targetSelector: string;
        index: number;
        guideID: string;
        data: any;
    });
    resetBackdrop(): void;
    private createOverlay;
    remove(): void;
}
export default Backdrop;
