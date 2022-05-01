import { TooltipData, HotspotAndTooltipTarget as Target, StepActions } from "../common/types";
import "intersection-observer";
export default class Tooltip {
    private targetElement;
    readonly target: Target;
    private tippyInstance;
    readonly uid: string;
    readonly data: TooltipData;
    private actions;
    readonly styleProps: Object;
    private targetsAndEventListeners;
    private backdropInstance;
    private index;
    private guideID;
    private intersectionObserver;
    private isTooltipShown;
    constructor({ target, guideID, index, data, actions, styleProps, }: {
        target: Target;
        guideID: string;
        data: TooltipData;
        index: number;
        actions: StepActions;
        styleProps: Object;
    });
    private attachIntersectionObserver;
    private hide;
    private consolidateActions;
    private addBackdrop;
    show(): void;
    remove(): void;
    private getListenerFromMethod;
    private addEventListenerToTarget;
    private removeAllEventListeners;
}
