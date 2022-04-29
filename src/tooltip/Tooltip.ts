import { document, window } from 'global';
import createTooltip from './createTooltip';
import { mergeObjects, getStepUID } from '../common/utils';
import { log, warn, error } from '../common/logger';
import { TooltipData, HotspotAndTooltipTarget as Target, StepActions } from '../common/types';
import defaultToolipActions from './defaultTooltipActions';
import Backdrop from '../backdrop';
import 'intersection-observer';

const defaultBackdropData = {
    disabled: false,
    color: '#444',
    opacity: '0.5',
    stageGap: 5,
    nextOnOverlayClick: false,
}

export default class Tooltip {
    private targetElement: HTMLElement;
    readonly target: Target;
    private tippyInstance: any;
    readonly uid: string;
    readonly data: TooltipData;
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
    private intersectionObserver: any;
    private isTooltipShown: boolean = false;

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

            log('%c Tooltip constructor! ', 'background: #222; color: #bada55');

            this.target = target;
            const { elementSelector } = target;
            this.styleProps = styleProps || {};
            this.data = data;
            this.index = index;

            const progressOn = data.progressOn || {};
            this.data.progressOn = {
                eventType: 'click',
                elementSelector,
                ...progressOn
            }

            const backdrop = data.backdrop || {};
            this.data.backdrop = {
                ...defaultBackdropData,
                ...backdrop
            }
            this.data.offset = this.data.offset || [0, 10];
            if(!this.data.backdrop.disabled) {
                this.data.offset[1] = this.data.offset[1] +
                    this.data.backdrop.stageGap!;
            }

            this.consolidateActions(actions);
            this.uid=getStepUID({ guideID, index, type: 'tooltip' });
            this.guideID = guideID;
            this.targetElement = document.querySelector(elementSelector);
            this.attachIntersectionObserver();
            log('tooltip started')
        }

        private attachIntersectionObserver(): void {
            // show tooltip when it comes into view, remove it when it goes out of it
            this.show = this.show.bind(this);
            this.remove = this.remove.bind(this);
            this.hide = this.hide.bind(this);

            const { IntersectionObserver } = window;

            this.intersectionObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    const { isIntersecting, target } = entry;
                    if(!target.isSameNode(this.targetElement)){
                        return log(
                            'Observer target doesn\'t match tooltip target'
                        );
                    }
                    if(isIntersecting){
                        this.show();
                    } else {
                        if(this.tippyInstance){
                            // if it has been created yet at all
                            this.hide();
                        } else {
                            if(this.data.scrollIntoView) {
                                this.targetElement.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center',
                                    inline: 'center'
                                });
                            }
                        }
                    }
                });
            }, {
                root: null,
                threshold: 0.95
            });
            this.intersectionObserver.observe(this.targetElement);
        }

        private hide(): void {
            // log('tooltip hide');
            this.tippyInstance.hide();
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
                color
            }
            this.backdropInstance = new Backdrop({
                targetSelector: this.target.elementSelector,
                guideID: this.guideID,
                index: this.index,
                data
            });
            if (this.data.backdrop!.nextOnOverlayClick){
                Array.from<HTMLElement>(document.getElementsByClassName(
                    this.backdropInstance.overlaySelectorClass
                ))
                .forEach((target: HTMLElement) => {
                    this.addEventListenerToTarget(target, 'next');
                });
            }
        }

        public show(): void {
            if (!this.targetElement) return error(
                'Error: target element not found'
            );
            if (this.isTooltipShown) return error(
                'Tooltip is already displayed'
            );

            const { progressOn, backdrop } = this.data;

            const { eventType, disabled } = progressOn!;
            disabled || this.addEventListenerToTarget(
                this.targetElement,
                'next',
                eventType
            );

            if(!this.tippyInstance) {
                // tippy was never initiated
                const { uid, actions, styleProps, data, index } = this;
                this.tippyInstance = createTooltip({
                    uid,
                    target: this.targetElement,
                    actions,
                    styleProps,
                    data,
                    index
                });
            } else {
                // tippy was hidden
                this.tippyInstance.show();
            }
            this.isTooltipShown = true;
            backdrop!.disabled || this.addBackdrop();
        }

        public remove(): void {
            if (!this.isTooltipShown) return error(
                `Attempted to remove but tooltip is not shown`
            );
            log(`removing tooltip ${this.uid}`);
            this.removeAllEventListeners();
            this.intersectionObserver.disconnect();
            this.backdropInstance && this.backdropInstance.remove();
            this.tippyInstance.unmount();
            this.tippyInstance.destroy();
            this.tippyInstance = null;
            this.isTooltipShown = false;
        }

        private getListenerFromMethod(method: string): EventListenerOrEventListenerObject {
            switch(method) {
                case 'next':
                    return window.Lusift.next;
                case 'prev':
                    return window.Lusift.prev;
                case 'close':
                    return this.remove;
                default:
                    return () => {};
            }
        }

        private addEventListenerToTarget(
            target: HTMLElement,
            method='next',
            eventType='click'
        ): void {
            // add this event listener at the creation of each tooltip step and
            // remove it at removal of it
            target.addEventListener(
                eventType,
                this.getListenerFromMethod(method)
            );
            this.targetsAndEventListeners.push({
                method,
                target,
                eventType
            });
        }

        private removeAllEventListeners(): void {
            this.targetsAndEventListeners.forEach(
                ({ method, target, eventType }) => {
                    target.removeEventListener(
                        eventType,
                        this.getListenerFromMethod(method)
                    );
                    log(
                        `remove event listener of type ${eventType} `+
                            `and method ${method}`
                    );
                });
            this.targetsAndEventListeners = [];
        }
}
