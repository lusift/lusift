import { Content, TrackingState } from "../common/types";
declare class Lusift {
    private content;
    render: Function;
    activeGuide: {
        instance: any;
        id: string;
    } | null;
    progress: number;
    private next;
    private prev;
    private close;
    private goto;
    private onNext;
    private onPrev;
    private onClose;
    constructor();
    private hasGuideDataChanged;
    private reconcileContentWithLocalState;
    setContent(content: Content): void;
    clearContent(): void;
    refresh(): void;
    showContent<T extends string>(contentID: T extends '' ? never : T): void;
    private prepareHooks;
    setGlobalStyle(styleText: string): void;
    getTrackingState(): TrackingState | null;
    devShowStep(guideID: string, stepNumber: number): void;
}
declare const _default: Lusift;
export default _default;
