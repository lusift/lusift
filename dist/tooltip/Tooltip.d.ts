import { TooltipData, HotspotAndTooltipTarget as Target, StepActions } from "../common/types";
export default class Tooltip {
    private targetElement;
    readonly target: Target;
    private fuitInstance;
    readonly uid: string;
    readonly data: TooltipData;
    private actions;
    readonly styleProps: Object;
    private targetsAndEventListeners;
    private backdropInstance;
    private index;
    private guideID;
    private isTooltipShown;
    private backdropAutoUpdateCleanup;
    private onRemove;
    constructor({ target, guideID, index, data, actions, styleProps, onRemove }: {
        target: Target;
        guideID: string;
        data: TooltipData;
        index: number;
        actions: StepActions;
        styleProps: Object;
        onRemove: Function;
    });
    private hide;
    private addBackdrop;
    show(): Promise<void>;
    remove(): void;
    private getListenerFromMethod;
    private addEventListenerToTarget;
    private removeAllEventListeners;
}
