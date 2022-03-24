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

// TODO take scroll view into account to make the tooltip appear and disappear
// TODO add Actions validator
// TODO tooltip - the arrow should have more options than to just be at the center
// TODO hide and show tooltip instead of creating and destroying it every time when scroll view changes

const defaulBackdropData = {
    disabled: false,
    color: '#444',
    opacity: '0.5',
    stageGap: 5,
    nextOnOverlayClick: false,
}


const isElementInViewport = (el: document.HTMLElement): any => {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

const onElementVisibilityChange = (el: document.HTMLElement, callback: Function): Function => {
  let old_visible: boolean;
  return function () {
    let visible = isElementInViewport(el);
    if (visible != old_visible) {
      old_visible = visible;
      if (typeof callback == 'function') {
        callback();
      }
    }
  }
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
        target: document.HTMLElement;
        eventType: string;
    }[] = [];
    private backdrop: any;
    private isTooltipShown: boolean;

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
            // TODO factor stageGap to offset
            console.log(this.data);
            this.data.progressOn = {
                eventType: 'click',
                elementSelector: target.elementSelector,
                ...progressOn
            }

            const backdrop = data.backdrop || {};
            this.data.backdrop = {
                ...defaulBackdropData,
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
            this.nextStep=nextStep;
            this.prevStep=prevStep;
            this.closeGuide=closeGuide;
            window.alert('tooltip initiated')
            document.body.style.height='1000px'
            this.attachShowEventHandler();
            // TODO remove this handler on tooltip removal
        }

        private attachShowEventHandler() {
            this.show = this.show.bind(this);
            this.remove = this.remove.bind(this);

            let handler = onElementVisibilityChange(this.targetElement, () => {
                window.setTimeout(() => {
                    if(isElementInViewport(this.targetElement)) {
                        console.log('element has come into viewport. show');
                        this.show();
                    } else {
                        console.log('element has went out of viewport. remove');
                        this.remove();
                    }
                }, 300);
            });
            handler = handler.bind(this);

            console.log('event listener attached')
            const { addEventListener, attachEvent } = window;
            if (window.addEventListener) {
                addEventListener('DOMContentLoaded', handler, false);
                addEventListener('load', handler, false);
                addEventListener('scroll', handler, false);
                addEventListener('resize', handler, false);
            } else if (window.attachEvent)  {
                attachEvent('onDOMContentLoaded', handler);
                attachEvent('onload', handler);
                attachEvent('onscroll', handler);
                attachEvent('onresize', handler);
            }
        }

        private consolidateActions(actions: StepActions) {
          // merge default actions with incoming actions provided by the developer(user)
          this.actions = mergeObjects(this.actions, actions);
          /* console.log('consolidateActions')
          console.log(this.actions); */
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

            const { placement, arrow, progressOn, bodyContent, offset, backdrop } = this.data;

            const { eventType, disabled } = progressOn;
            disabled || this.addEventListenerToTarget(this.targetElement, 'next', eventType);

            backdrop.disabled || this.addBackdrop();

            this.tippyInstance = createTooltip({
                remove: this.closeGuide,
                uid: this.uid,
                nextStep: this.nextStep,
                prevStep: this.prevStep,
                target: this.targetElement,
                actions: this.actions,
                styleProps: this.styleProps,
                arrow,
                bodyContent,
                placement,
                offset,
            });
            this.isTooltipShown = true;
        }

        public remove(): void {
            // TODO tippyInstance was undefined once
            // probably when constructor() ran but tippy was never initiated
            if (!this.isTooltipShown) return console.log('Attempted to remove but tooltip is not shown');
            console.log(`removing tooltip ${this.uid}`);
            this.removeAllEventListeners();
            this.backdrop && this.backdrop.remove(); // is this right??
            this.tippyInstance.unmount();
            this.tippyInstance.destroy();
            this.isTooltipShown = false;
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

        private addEventListenerToTarget(target: document.HTMLElement, method='next', eventType='click'): void {
            // add this event listener at the  creation of each tooltip step and
            // remove it at removal of it
            // TODO Look at how those saas do it - the options they give that is

            target.addEventListener(eventType, this.getListenerFromMethod(method));
            this.targetsAndEventListeners.push({ method, target, eventType });
            // console.log(this.targetsAndEventListeners);
        }

        private removeAllEventListeners(): void {
            this.targetsAndEventListeners.forEach(({ method, target, eventType }) => {
                // TODO Write if for targetElement being null, btw why is it null (repeat this across other files too)
                target.removeEventListener(eventType, this.getListenerFromMethod(method));
                console.log(`remove event listener of type ${eventType} and method ${method}`);
            });
            this.targetsAndEventListeners = [];
            // console.log(this.targetsAndEventListeners);
        }
}
