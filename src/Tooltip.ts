import { document, window } from 'global';
import createTooltip from './createTooltip';
import { mergeObjects, getStepUID } from './utils';
import { TooltipData, HotspotAndTooltipTarget as Target, StepActions } from './types';
import defaultToolipActions from './defaultTooltipActions';
import Backdrop from './Backdrop';

// TODO refactor entire codebase into modular files and directory structure

const defaultBackdropData = {
    disabled: false,
    color: '#444',
    opacity: '0.5',
    stageGap: 5,
    nextOnOverlayClick: false,
}

export default class Tooltip {
    private targetElement: document.HTMLElement;
    readonly target: Target;
    private tippyInstance: any;
    readonly uid: string;
    readonly backdropID: string;
    readonly data: TooltipData;
    private actions: StepActions = defaultToolipActions;
    readonly styleProps: Object = {};
    private targetsAndEventListeners: {
        method: string;
        target: document.HTMLElement;
        eventType: string;
    }[] = [];
    private backdrop: any;
    private isTooltipShown: boolean;

    constructor(
        {
            target,
            guideID,
            index,
            data,
            actions,
            styleProps
        }:
            {
            target: Target;
            guideID: string;
            data: TooltipData;
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
                ...defaultBackdropData,
                ...backdrop
            }
            this.data.offset = this.data.offset || [0, 10];
            if(!this.data.backdrop.disabled) {
                this.data.offset[1] = this.data.offset[1] + this.data.backdrop.stageGap;
            }

            this.consolidateActions(actions);
            this.uid=getStepUID({ guideID, index, type: 'tooltip' });
            this.backdropID=getStepUID({ guideID, index, type: 'backdrop' });
            this.targetElement = document.querySelector(this.target.elementSelector);
            // window.alert('tooltip initiated')
            this.attachIntersectionObserver();
        }

        private attachIntersectionObserver(): void {
            // show tooltip when it comes into view, remove it when it goes out of it
            this.show = this.show.bind(this);
            this.remove = this.remove.bind(this);
            this.hide = this.hide.bind(this);

            const { IntersectionObserver } = window;

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    const { isIntersecting, target } = entry;
                    if(!target.isSameNode(this.targetElement)){
                        return console.log('Observer target doesn\'t match tooltip target');
                    }
                    if(isIntersecting){
                        this.show();
                    } else {
                        this.hide();
                    }
                });
            }, {
                root: null,
                threshold: 0.95
            });
            observer.observe(this.targetElement);
        }

        private consolidateActions(actions: StepActions) {
          // merge default actions with incoming actions provided by the developer(user)
          this.actions = mergeObjects(this.actions, actions);
          /* console.log('consolidateActions')
          console.log(this.actions); */
        }

        private hide(): void {
            this.tippyInstance.hide();
            this.backdrop && this.backdrop.remove();
            this.isTooltipShown = false;
        }

        private addBackdrop(): void {
            this.backdrop = new Backdrop({
                targetSelector: this.target.elementSelector,
                uid: this.backdropID,
                data: this.data.backdrop
            });
            if (this.data.backdrop.nextOnOverlayClick){
                Array.from(document.getElementsByClassName(this.backdrop.overlaySelectorClass)).forEach(target => {
                    this.addEventListenerToTarget(target, 'next');
                });
            }
        }

        public show(): void {
            if (!this.targetElement) return console.warn('Error: target element not found');
            if (this.isTooltipShown) return console.log('Tooltip is already displayed');

            const { progressOn, backdrop } = this.data;

            const { eventType, disabled } = progressOn;
            disabled || this.addEventListenerToTarget(this.targetElement, 'next', eventType);

            backdrop.disabled || this.addBackdrop();

            if(!this.tippyInstance) {
                // tippy was never initiated
                this.tippyInstance = createTooltip({
                    uid: this.uid,
                    target: this.targetElement,
                    actions: this.actions,
                    styleProps: this.styleProps,
                    data: this.data,
                });
            } else {
                // tippy was hidden
                this.tippyInstance.show();
            }
            this.isTooltipShown = true;
        }

        public remove(): void {
            if (!this.isTooltipShown) return console.log('Attempted to remove but tooltip is not shown');
            console.log(`removing tooltip ${this.uid}`);
            this.removeAllEventListeners();
            this.backdrop && this.backdrop.remove();
            this.tippyInstance.unmount();
            this.tippyInstance.destroy();
            this.isTooltipShown = false;
        }

        private getListenerFromMethod(method: string): Function {
            switch(method) {
                case 'next':
                    return window.Lusift.next;
                case 'prev':
                    return window.Lusift.prev;
                case 'close':
                    return this.remove;
            }
        }

        private addEventListenerToTarget(target: document.HTMLElement, method='next', eventType='click'): void {
            // add this event listener at the creation of each tooltip step and
            // remove it at removal of it
            target.addEventListener(eventType, this.getListenerFromMethod(method));
            this.targetsAndEventListeners.push({ method, target, eventType });
            // console.log(this.targetsAndEventListeners);
        }

        private removeAllEventListeners(): void {
            this.targetsAndEventListeners.forEach(({ method, target, eventType }) => {
                target.removeEventListener(eventType, this.getListenerFromMethod(method));
                console.log(`remove event listener of type ${eventType} and method ${method}`);
            });
            this.targetsAndEventListeners = [];
            // console.log(this.targetsAndEventListeners);
        }
}
