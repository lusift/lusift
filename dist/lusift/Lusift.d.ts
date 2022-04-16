import { Content, TrackingState } from '../common/types';
declare class Lusift {
    private content;
    private guideInstance;
    render: Function;
    private contentSet;
    activeGuideID: string;
    progress: number;
    private next;
    private prev;
    private close;
    private goto;
    private onNext;
    private onPrev;
    private onClose;
    constructor();
    setGlobalStyle(styleText: string): void;
    getTrackingState(): TrackingState;
    private hasGuideDataChanged;
    devShowStep(guideID: string, stepNumber: number): void;
    private reconcileContentWithLocalState;
    setContent(content: Content): void;
    clearContent(): void;
    refresh(): void;
    showContent(contentID: string): void;
    private prepareHooks;
}
declare const _default: Lusift;
export default _default;
