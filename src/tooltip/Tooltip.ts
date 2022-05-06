import { document, window } from "global";
import createTooltip from "./createTooltip";
import { mergeObjects, getStepUID } from "../common/utils";
import { log, warn, error } from "../common/logger";
import { TooltipData, HotspotAndTooltipTarget as Target, StepActions } from "../common/types";
import defaultToolipActions from "./defaultTooltipActions";
import Backdrop from "../backdrop";

const defaultBackdropData = {
    disabled: false,
    color: "#444",
    opacity: "0.5",
    stageGap: 5,
    nextOnOverlayClick: false,
};

const defaultOffset = [0, 10];

// TODO: focus-trap not detecting tabbable elements
// TODO: offset value is weird
// TODO: offset, should it factor in arrow size on top?
// TODO: tooltip is below backdrop
// TODO: should we have transition effects for backdrop? it's kind of jerky
// -- refactor to have zIndex for tooltip and backdrop as constants
// TODO: Fix style.css margins for progress-bar and close button
// TODO: Make the progress bar overflow because of border-radius not show
// TODO: Add debounce function in Backdrop
// TODO: Replace resize-observer with some native implementation
// TODO: Transfer focus to tooltip if there's backdrop, addFocusTrap.ts

/*
 * TODO: Add this scroll behaviour
   if (this.data.scrollIntoView) {
       this.targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
        });
    }
    --
https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
 */
export default class Tooltip {
    private targetElement: HTMLElement;
    readonly target: Target;
    private fuitInstance: any;
    readonly uid: string;
    readonly data: Partial<TooltipData>;
    private actions: StepActions = defaultToolipActions;
    readonly styleProps: Object = {};
    private targetsAndEventListeners: {
        method: string;
        target: HTMLElement;
        eventType: string;
    }[] = [];
    private backdropInstance: any;
    private index: number;
    private guideID: string;
    private isTooltipShown: boolean = false;

    constructor({
        target,
        guideID,
        index,
        data,
        actions,
        styleProps,
    }: {
        target: Target;
        guideID: string;
        data: Partial<TooltipData>;
        index: number;
        actions: StepActions;
        styleProps: Object;
    }) {
        log("%c Tooltip constructor! ", "background: #222; color: #bada55");

        this.target = target;
        const { elementSelector } = target;
        this.styleProps = styleProps || {};
        this.data = data;
        this.index = index;

        const progressOn = data.progressOn || {};
        this.data.progressOn = {
            eventType: "click",
            elementSelector,
            ...progressOn,
        };

        const backdrop = data.backdrop || {};
        this.data.backdrop = {
            ...defaultBackdropData,
            ...backdrop,
        };
        this.data.offset = this.data.offset || defaultOffset;
        if (!this.data.backdrop.disabled) {
            this.data.offset[1] = this.data.offset[1] + this.data.backdrop.stageGap!;
        }

        this.consolidateActions(actions);
        this.uid = getStepUID({ guideID, index, type: "tooltip" });
        this.guideID = guideID;
        this.targetElement = document.querySelector(elementSelector);
        this.show();
        log("tooltip started");
    }

    private hide(): void {
        // log('tooltip hide');
        this.fuitInstance.hide();
        this.removeAllEventListeners();
        this.backdropInstance && this.backdropInstance.remove();
        this.backdropInstance = null;
        this.isTooltipShown = false;
    }

    private consolidateActions(actions: StepActions) {
        // merge default actions with incoming actions provided by the developer(user)
        this.actions = mergeObjects(this.actions, actions);
    }

    private addBackdrop(): void {
        const { stageGap, opacity, color } = this.data.backdrop!;
        const data = {
            stageGap,
            opacity,
            color,
        };
        this.backdropInstance = new Backdrop({
            targetSelector: this.target.elementSelector,
            guideID: this.guideID,
            index: this.index,
            data,
        });
        if (this.data.backdrop!.nextOnOverlayClick) {
            Array.from<HTMLElement>(
                document.getElementsByClassName(this.backdropInstance.overlaySelectorClass),
            ).forEach((target: HTMLElement) => {
                this.addEventListenerToTarget(target, "next");
            });
        }
    }

    public async show() {
        if (!this.targetElement) return error("Error: target element not found");
        if (this.isTooltipShown) return error("Tooltip is already displayed");

        const { progressOn, backdrop } = this.data;

        const { eventType, disabled } = progressOn!;
        disabled || this.addEventListenerToTarget(this.targetElement, "next", eventType);

        if (!this.fuitInstance) {
            // fuit was never initiated
            const { uid, actions, styleProps, data, index } = this;
            this.fuitInstance = await createTooltip({
                uid,
                target: this.targetElement,
                actions,
                styleProps,
                data,
                index,
                onShow: (instance) => {
                    backdrop!.disabled || this.addBackdrop.bind(this)();
                    this.isTooltipShown = true;
                },
                onHide: (instance) => {
                    if(!backdrop!.disabled) {
                        this.backdropInstance && this.backdropInstance.remove();
                        this.backdropInstance = null;
                        this.isTooltipShown = false;
                    }
                },
            });
        } else {
            // fuit was hidden
            this.fuitInstance.show();
        }
    }

    public remove(): void {
        if (!this.isTooltipShown) return error(`Attempted to remove but tooltip is not shown`);
        log(`removing tooltip ${this.uid}`);
        this.removeAllEventListeners();
        this.backdropInstance && this.backdropInstance.remove();
        this.fuitInstance.remove();
        this.fuitInstance = null;
        this.isTooltipShown = false;
    }

    private getListenerFromMethod(method: string): EventListenerOrEventListenerObject {
        switch (method) {
            case "next":
                return window.Lusift.next;
            case "prev":
                return window.Lusift.prev;
            case "close":
                return this.remove;
            default:
                return () => {};
        }
    }

    private addEventListenerToTarget(
        target: HTMLElement,
        method = "next",
        eventType = "click",
    ): void {
        // add this event listener at the creation of each tooltip step and
        // remove it at removal of it
        target.addEventListener(eventType, this.getListenerFromMethod(method));
        this.targetsAndEventListeners.push({
            method,
            target,
            eventType,
        });
    }

    private removeAllEventListeners(): void {
        this.targetsAndEventListeners.forEach(({ method, target, eventType }) => {
            target.removeEventListener(eventType, this.getListenerFromMethod(method));
            log(`remove event listener of type ${eventType} ` + `and method ${method}`);
        });
        this.targetsAndEventListeners = [];
    }
}
