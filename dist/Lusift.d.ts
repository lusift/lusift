import { Content } from '../types';
declare class Lusift {
    private content;
    private guideInstance;
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
    getTrackingState(): object;
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
