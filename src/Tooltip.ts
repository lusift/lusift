import { document, window } from 'global';
import createTooltip from './createTooltip';
import { createPopper } from '@popperjs/core';
import popperOptions from './popperOptions';

// import createPopper from './createPopper';

interface PopperInstanceType {
    state: Object;
    destroy: () => void,
    forceUpdate: () => void,
    update: () => Promise<Object>,
    setOptions: (
    options: Object | ((Object) => Object)
    ) => Promise<Object>,
}

interface TooltipData {
    title: string;
    placement: any; // Placement type from popper or manually
    arrow: boolean;
}

// reference to tooltip element is lost after any dom changes

interface Target {
    path: {
        value: string;
        comparator: string;
    }
    elementSelector: string;
}

// TODO see if an unrelated dom change loses controls to the tooltip

export default class Tooltip {
    private targetElement: document.HTMLElement;
    readonly target: Target;
    private tooltipElement: document.HTMLElement;
    private popperInstance: PopperInstanceType;
    readonly uid: string;
    readonly data: TooltipData;
    private nextStep: Function;
    private prevStep: Function;
    private closeGuide: Function;

    constructor(
        {
            target,
            guideID,
            nextStep,
            prevStep,
            closeGuide,
            index,
            data
        }:
        {
            target: Target;
            guideID: string;
            data: TooltipData;
            nextStep: Function;
            prevStep: Function,
            closeGuide: Function,
            index: number,
        }) {

        this.target=target;
        this.targetElement = document.querySelector(this.target.elementSelector);
        this.data = data;
        this.uid=`g-${guideID}--t-${index}`;
        this.nextStep=nextStep;
        this.prevStep=prevStep;
        this.closeGuide=closeGuide;
        this.create();
    }

    private create(): void {
        if (!this.targetElement) return console.log('Error: target element not found');

        const { title, placement, arrow } = this.data;

        this.tooltipElement = createTooltip({
            remove: this.closeGuide,
            uid: this.uid,
            nextStep: this.nextStep,
            prevStep: this.prevStep,
            toShowArrow: arrow,
            title,
        });

        this.popperInstance = createPopper(this.targetElement, this.tooltipElement, {
            ...popperOptions,
            placement,
            modifiers: [
                ...popperOptions.modifiers,
                {
                    name: 'flip',
                    enabled: placement === 'auto'
                },
                {
                    name: 'arrow',
                    enabled: arrow
                }
            ]
        });
        // console.log(this.popperInstance);
    }

    public remove(): void {
        console.log(`removing tooltip ${this.uid}`)
        this.tooltipElement.remove();
        this.popperInstance.forceUpdate();
        this.popperInstance.destroy();
        console.log(this.popperInstance.state);
    }

    /* public getState() {
        return this.popperInstance.state;
    } */
}
