import { document, window } from 'global';
import createTooltip from './createTooltip';
import { createPopper } from '@popperjs/core';
import popperOptions from './popperOptions';

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
        comporator: string;
    }
    elementSelector: string;
}

export default class Tooltip {
    private targetElement: document.HTMLElement;
    readonly target: Target;
    private tooltipElement: document.HTMLElement;
    private popperInstance: PopperInstanceType;
    readonly uid: string;
    readonly data: TooltipData;

    constructor(
        {
            target,
            data
        }:
        {
            target: Target;
            guideID: string;
            data: TooltipData;
            nextStep: Function;
            prevStep: Function,
            index: number,
        }) {

        this.target=target;
        this.targetElement = document.querySelector(this.target.elementSelector);
        this.data = data;
        this.create();
    }

    private create(): void {
        if (!this.targetElement) return console.log('Error: target element not found');

        const { title, placement, arrow } = this.data;

        this.tooltipElement = createTooltip({
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
    /* public getState() {
        return this.popperInstance.state;
    } */
}

