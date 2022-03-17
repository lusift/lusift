import { document, window } from 'global';
import createTooltip from './createTooltip';
import { createPopper } from '@popperjs/core';
import popperOptions from './popperOptions';
import { PopperInstanceType, TooltipData, TooltipTarget } from './types';

// import createPopper from './createPopper';


// reference to tooltip element is lost after any dom changes
// TODO see if an unrelated dom change loses controls to the tooltip

interface TargetAndEventListeners {
    method: string;
    target: string;
}[]

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
    // private targetsAndEventListeners: TargetAndEventListeners;
    private targetsAndEventListeners: {
        method: string;
        target: string;
        eventType: string;
    }[] = [];

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
        }

        private create(): void {
            if (!this.targetElement) return console.warn('Error: target element not found');

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
            this.addEventListenerToTarget(this.target.elementSelector);
        }

        public remove(): void {
            console.log(`removing tooltip ${this.uid}`)
            this.removeAllEventListeners();
            this.tooltipElement.remove();
            this.popperInstance.forceUpdate();
            this.popperInstance.destroy();
            // console.log(this.popperInstance.state);
        }

        private getListenerFromMethod(method: string): Function {
            switch(method) {
                case 'next':
                    return this.nextStep;
                case 'prev':
                    return this.prevStep;
                case 'close':
                    return this.remove;
            }
        }

        private addEventListenerToTarget(target: string, method='next', eventType='click'): void {
            // add this event listener at the  creation of each tooltip step and
            // remove it at removal of it
            // TODO Look at how those saas do it - the options they give that is
            const targetElement = document.querySelector(target);

            targetElement.addEventListener(eventType, this.getListenerFromMethod(method));
            this.targetsAndEventListeners.push({ method, target, eventType });
            console.log(this.targetsAndEventListeners);
        }

        private removeAllEventListeners(): void {
            this.targetsAndEventListeners.forEach(({ method, target, eventType }) => {
                const targetElement = document.querySelector(target);
                targetElement.removeEventListener(eventType, this.getListenerFromMethod(method));
                console.log(`remove event listener of type ${eventType} and method ${method}`);
            });
            this.targetsAndEventListeners = [];
            console.log(this.targetsAndEventListeners);
        }
}
