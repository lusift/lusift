import { TooltipData, HotspotAndTooltipTarget as Target, StepActions } from "../common/types";
export default class Tooltip {
    private targetElement;
    readonly target: Target;
    private fuitInstance;
    readonly uid: string;
    readonly data: Partial<TooltipData>;
    private actions;
    readonly styleProps: Object;
    private targetsAndEventListeners;
    private backdropInstance;
    private index;
    private guideID;
    private isTooltipShown;
    constructor({ target, guideID, index, data, actions, styleProps, }: {
        target: Target;
        guideID: string;
        data: Partial<TooltipData>;
        index: number;
        actions: StepActions;
        styleProps: Object;
    });
    private hide;
    private consolidateActions;
    private addBackdrop;
    show(): Promise<void>;
    remove(): void;
    private getListenerFromMethod;
    private addEventListenerToTarget;
    private removeAllEventListeners;
}
