import { document, window } from 'global';
import createTooltip from './createTooltip';
import { mergeObjects, getStepUID } from './utils';
import { TooltipData, TooltipTarget, StepActions } from './types';
import defaultToolipActions from './defaultTooltipActions';
import Backdrop from './Backdrop';

// TODO see if an unrelated dom change loses controls to the tooltip
// TODO Developer should be able to modify css on the global guide level, as well as on the step level
// TODO Add option for beacon in Tooltip
// TODO Add developer helper method to quickly render an element on the screen during development
// TODO Add asynchrous hotspots
// TODO Add steps config, and steps styles to apply to all steps

// TODO add overlay{}
// TODO take scroll view into account to make the tooltip appear and disappear
// TODO add Actions validator

// TODO in data type validators, when varifying that a property is an object,
// make sure to take into account null

const defaulBackdropData = {
    disabled: false,
    color: '#444',
    opacity: '0.5',
    stageGap: 5,
    nextOnOverlayClick: false
}

export default class Tooltip {
    private targetElement: document.HTMLElement;
    readonly target: TooltipTarget;
    private tippyInstance: any;
    readonly uid: string;
    readonly backdropID: string;
    readonly data: TooltipData;
    private actions: StepActions = defaultToolipActions;
    readonly styleProps: Object = {};
    private nextStep: Function;
    private prevStep: Function;
    private closeGuide: Function;
    private targetsAndEventListeners: {
        method: string;
        target: string;
        eventType: string;
    }[] = [];
    private backdrop: any;

    constructor(
        {
            target,
            guideID,
            nextStep,
            prevStep,
            closeGuide,
            index,
            data,
            actions,
            styleProps
        }:
            {
            target: TooltipTarget;
            guideID: string;
            data: TooltipData;
            nextStep: Function;
            prevStep: Function,
            closeGuide: Function,
            index: number,
            actions: StepActions,
            styleProps: Object
        }) {

            console.log('%c Tooltip constructor! ', 'background: #222; color: #bada55');

            this.target = target;
            this.styleProps = styleProps || {};
            this.data = data;

            const progressOn = data.progressOn || {};
            this.data.progressOn = {
                eventType: 'click',
                elementSelector: target.elementSelector,
                ...progressOn
            }

            const backdrop = data.backdrop || {};
            this.data.backdrop = {
                disabled: true,
                ...backdrop
            }

            this.consolidateActions(actions);
            this.uid=getStepUID({ guideID, index, type: 'tooltip' });
            this.backdropID=getStepUID({ guideID, index, type: 'backdrop' });
            this.targetElement = document.querySelector(this.target.elementSelector);
            this.nextStep=nextStep;
            this.prevStep=prevStep;
            this.closeGuide=closeGuide;
            window.alert('tooltip initiated')
            this.show();
        }

        private consolidateActions(actions: StepActions) {
          // merge default actions with incoming actions provided by the developer(user)
          this.actions = mergeObjects(this.actions, actions);
          /* console.log('consolidateActions')
          console.log(this.actions); */
        }

        public show(): void {
            if (!this.targetElement) return console.warn('Error: target element not found');

            const { placement, arrow, progressOn, bodyContent, offset, backdrop } = this.data;

            const { eventType, elementSelector, disabled } = progressOn;
            // addEventListenerToTarget method targets dummy element from Backdrop if executed after dummy is created
            disabled || this.addEventListenerToTarget(elementSelector, 'next', eventType);

            if(!backdrop.disabled) {
                this.backdrop = new Backdrop({
                    targetSelector: this.target.elementSelector,
                    uid: this.backdropID,
                    data: backdrop
                });
                // TODO only one overlay on the screen at a time
                const overlaySelector = '#lusift-overlay'; // constant
                this.backdrop.nextOnOverlayClick && this.addEventListenerToTarget(overlaySelector, 'next');
            }

            this.tippyInstance = createTooltip({
                remove: this.closeGuide,
                uid: this.uid,
                nextStep: this.nextStep,
                prevStep: this.prevStep,
                target: backdrop.disabled ? this.targetElement : this.backdrop.stage,
                actions: this.actions,
                styleProps: this.styleProps,
                arrow,
                bodyContent,
                placement,
                offset,
            });
        }

        public remove(): void {
            console.log(`removing tooltip ${this.uid}`);
            this.removeAllEventListeners();
            this.backdrop && this.backdrop.remove();
            this.tippyInstance.unmount();
            this.tippyInstance.destroy();
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
            // console.log(this.targetsAndEventListeners);
        }

        private removeAllEventListeners(): void {
            this.targetsAndEventListeners.forEach(({ method, target, eventType }) => {
                const targetElement = document.querySelector(target);
                // TODO Write if for targetElement being null, btw why is it null (repeat this across other files too)
                targetElement.removeEventListener(eventType, this.getListenerFromMethod(method));
                console.log(`remove event listener of type ${eventType} and method ${method}`);
            });
            this.targetsAndEventListeners = [];
            // console.log(this.targetsAndEventListeners);
        }


        public removeOverlay() {
          //
        }
}
