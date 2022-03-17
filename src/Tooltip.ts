import { document, window } from 'global';
import createTooltip from './createTooltip';
import { createPopper } from '@popperjs/core';
import popperOptions from './popperOptions';
import { PopperInstanceType, TooltipData, TooltipTarget } from './types';

// import createPopper from './createPopper';


// reference to tooltip element is lost after any dom changes
// TODO see if an unrelated dom change loses controls to the tooltip

export default class Tooltip {
    private targetElement: document.HTMLElement;
    readonly target: TooltipTarget;
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
            target: TooltipTarget;
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
        this.addTargetEvent('svg');
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

    public remove(removeListener): void {
        console.log(`removing tooltip ${this.uid}`)
        this.tooltipElement.remove();
        this.popperInstance.forceUpdate();
        this.popperInstance.destroy();
        console.log(this.popperInstance.state);
    }

    private addTargetEvent(elementSelector: string, method='next', eventType='click'): void {
        // control - next, prev, close
        // TODO add this event listener at the beginning of each tooltip step and
        // remove it at then end of it
        // TODO Look at how those saas do it - the options they give that is
        const targetElement = document.querySelector(elementSelector);
        const removeListener = () => this.removeTargetEvent({ eventType, method });

        targetElement.addEventListener(eventType, () => {
            switch(method) {
                case 'next':
                    this.nextStep(removeListener);
                    break;
                case 'prev':
                    this.prevStep(removeListener);
                    break;
                case 'close':
                    this.remove(removeListener);
                    break;
            }
        });
    }

    private removeTargetEvent({ eventType, method }: { eventType: string, method: string }): void {
        console.log(`remove event listener of type ${eventType} and method: ${method}`);
    }
}
