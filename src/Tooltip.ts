import { document } from 'global';
import createTooltip from './createTooltip';
import { createPopper } from '@popperjs/core';
import popperOptions from './popperOptions';
import { PopperInstanceType, TooltipData, TooltipTarget } from './types';

// import createPopper from './createPopper';

// reference to tooltip element is lost after any dom changes
// TODO see if an unrelated dom change loses controls to the tooltip
//
// We need to give the ability to modify html and css content
// - (btw, add a close button too - close x, dismiss link, none || skippable)
// - progress on click of: next button or target element
// Developer should be able to modify css on the global guide level, as well as on the step level
// Where should this stuff be stored at? Look at tippy
// How about a lusift.css file at the root?
// Add option for beacon in Tooltip
// Add developer helper method to quickly render an element on the screen
// Add animations
// Add asynchrous hotspots
// closeOnOverlayClick
// Add offset for Tooltip, with tippy
// Add steps config, and steps styles to apply to all steps

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

            this.target = target;
            this.targetElement = document.querySelector(this.target.elementSelector);
            this.data = data;

            const progressOn = data.progressOn || {};
            this.data.progressOn = {
                eventType: 'click',
                elementSelector: target.elementSelector,
                ...progressOn
            }
            this.uid=`g-${guideID}--t-${index}`;
            this.nextStep=nextStep;
            this.prevStep=prevStep;
            this.closeGuide=closeGuide;
            this.show();
        }

        public show(): void {
            if (!this.targetElement) return console.warn('Error: target element not found');

            const { placement, arrow, progressOn, bodyContent } = this.data;

            this.tooltipElement = createTooltip({
                remove: this.closeGuide,
                uid: this.uid,
                nextStep: this.nextStep,
                prevStep: this.prevStep,
                toShowArrow: arrow,
                bodyContent
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
            const { eventType, elementSelector, disabled } = progressOn;
            disabled || this.addEventListenerToTarget(elementSelector, 'next', eventType);
        }

        public remove(): void {
            console.log(`removing tooltip ${this.uid}`);
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
