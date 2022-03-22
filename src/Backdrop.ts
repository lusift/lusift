import { document, window } from 'global';
import { styleObjectToString, htmlStringToElement, getStepUID } from './utils/';

interface ElementPosition {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

// TODO should we change focus on page
// TODO factor in stage's padding in tooltip offset from target
// TODO should we make stage into the target for event listeners -- nah
// TODO some target inside stages are given padding in both dimensions and some not
// TODO fix stuff with zIndices
// 2147483647
// TODO since we're taking element outside of dom like that, can we preserve reference to the target element
// by linking reference of dummy element to target element?
// TODO wait for all fonts to load and such before executing Lusift,
// TODO don't take targetElement out of it's original position on dom

if(window) {
  window.alert = console.log
}

const defaultBackdropData = {
  stageGap: 5,
  opacity: '0.5',
  color: '#444',
}

interface BackdropData{
  stageGap: number;
  opacity: string;
  color: string;
}

interface BackdropForTooltipParameters{
  targetSelector: string;
  uid: string;
  data: BackdropData;
}

interface BackdropAsStepParameters{
  targetSelector: string;
  index: number;
  guideID: string;
  data: BackdropData;
}

type BackdropParameters = BackdropForTooltipParameters & BackdropAsStepParameters;

class Backdrop {

  private targetSelector: string;
  private targetPosition: ElementPosition;
  public overlay: any;
  public stage: any;
  private targetElementContextStyle: any;
  readonly targetDummySelector: string = '#lusift-backdrop-target-dummy';
  readonly stagedTargetClass: string;
  private targetContainer: any;
  private stageGap: number[];
  private data: BackdropData;

  constructor({
    targetSelector,
    uid,
    guideID,
    index,
    data
  }: BackdropParameters) {
    uid = uid || getStepUID({ guideID, index, type: 'backdrop' });
    this.stagedTargetClass = `${uid}__target`;

    this.data = {
      ...defaultBackdropData,
      ...data
    }
    this.targetSelector = `${targetSelector}:not(${this.targetDummySelector})`;
    const targetElement = document.querySelector(this.targetSelector);
    this.targetPosition = this.getElementPosition(targetElement);
    this.show();
  }

  private show(): void {
    window.alert('triggering overlay');
    this.addOverlay();
    const targetElement: document.HTMLElement  = document.querySelector(this.targetSelector);
    this.targetPosition = this.getElementPosition(targetElement);
    this.addTargetDummy();
    this.stageElement(targetElement);
  }


  private getElementPosition(element: document.HTMLElement): ElementPosition {
    const documentElement = document;
    const body = document.body;

    const scrollTop = window.pageYOffset || documentElement.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || documentElement.scrollLeft || body.scrollLeft;
    const elementRect = element.getBoundingClientRect();

    const position: ElementPosition = {
      top: elementRect.top + scrollTop,
      left: elementRect.left + scrollLeft,
      right: elementRect.left + scrollLeft + elementRect.width,
      bottom: elementRect.top + scrollTop + elementRect.height,
    };
    return position;
  }

  private addOverlay(): void {
    this.overlay = document.createElement('div');
    this.overlay.id = 'lusift-overlay';

    const { color, opacity } = this.data;

    const overlayStyle = {
      opacity,
      background: color,
      position: 'fixed',
      top: '0',
      left: '0',
      bottom: '0',
      right: '0',
      zIndex: 99998
    }
    this.overlay.style.cssText = styleObjectToString(overlayStyle);

    document.body.appendChild(this.overlay);
    // console.log('overlay added');
  }

  private addTargetDummy(): void {
    // console.log('adding dummy');

    // add a element of type target's element, and it's css to replace target element
    // change the target element's css to place it on the original cordinates but on top of overlay
    // put things back into place after overlay is triggered close

    const targetElement = document.querySelector(this.targetSelector);
    /* console.log('target position:');
    console.log(targetPosition); */

    // Save targetElement style that's being modified to get on stage
    const { position, zIndex, top, left, bottom, right, border } = targetElement.style;
    this.targetElementContextStyle = { position, zIndex, top, left, bottom, right, border };

    // dummy element
    const targetDummy = htmlStringToElement(targetElement.outerHTML);
    targetDummy.id = 'lusift-backdrop-target-dummy';
    targetDummy.class='';
    const targetDummyStyle = {
      ...targetElement.style,
      background: 'transparent',
    }

    targetDummy.style.cssText = styleObjectToString(targetDummyStyle);

    // insert to dom
    targetElement.outerHTML = targetDummy.outerHTML;
    // console.log('dummy added');
  }

  private stageElement(targetElement): void {

    /* console.log('saved target element:');
    console.log(targetElement) */

    this.stage = document.createElement('div');
    this.stage.id='lusift-stage';
    this.targetContainer = document.createElement('div');

    const requiredPadding = this.data.stageGap * 2;

    const stageWidth = (this.targetPosition.right - this.targetPosition.left) + (requiredPadding);
    const stageHeight = (this.targetPosition.bottom - this.targetPosition.top) + (requiredPadding);

    const stageStyle = {
      top: `${this.targetPosition.top - (requiredPadding / 2)}px`,
      left: `${this.targetPosition.left - (requiredPadding / 2)}px`,
      /* top: `${this.targetPosition.top }px`,
      left: `${this.targetPosition.left}px`,
      opacity: 0.5,*/
      bottom: '',
      right: '',
      position: 'absolute',
      width: `${stageWidth}px`,
      height: `${stageHeight}px`,
      display: 'flex',
      background: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '99998'
    };

    this.stage.style.cssText = styleObjectToString(stageStyle);
    this.targetContainer.style.cssText = styleObjectToString({
      ...stageStyle,
      top: `${this.targetPosition.top }px`,
      left: `${this.targetPosition.left}px`,
      width: `${(stageWidth - requiredPadding)}px`,
      height: `${(stageHeight - requiredPadding)}px`,
      zIndex: Number(stageStyle.zIndex)+1,
    });

    document.body.appendChild(this.stage);
    document.body.appendChild(this.targetContainer);
    this.targetContainer.appendChild(targetElement);

    const targetElementStyle = {
      ...targetElement.style,
      position: 'relative',
    }
    targetElement.style.cssText = styleObjectToString(targetElementStyle);

    // add lusift class to target
    targetElement.classList.add(this.stagedTargetClass);
    this.targetSelector = `${this.targetSelector}.${this.stagedTargetClass}`;

    // this.stage.appendChild(targetElement);

    // console.log('staged');
  }

  private offStage() {
    // reset target element's styles for positioning props
    const targetElement = document.querySelector(this.targetSelector);
    if(!targetElement){
      return console.warn('Target not found in dom');
    }
    const targetElementStyle = {
      ...targetElement.style,
      ...this.targetElementContextStyle
    }
    targetElement.style.cssText = styleObjectToString(targetElementStyle);
    targetElement.classList.remove(this.stagedTargetClass);
    this.targetSelector = this.targetSelector.replace(`.${this.stagedTargetClass}`, '');

    // insert this.targetElement back to it's original place
    const targetDummy = document.querySelector(this.targetDummySelector);
    if(!targetDummy){
      return console.warn('Target dummy not found in dom');
    }
    targetDummy.outerHTML = targetElement.outerHTML;
  }

  private remove(): void {
    this.offStage();
    this.overlay.remove();
    this.targetContainer.remove();
    this.stage.remove();
    // console.log('overlay and stage removed')
  }
}

export default Backdrop;
