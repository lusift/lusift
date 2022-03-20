import { document, window } from 'global';
import styleObjectToString from './utils/styleObjectToString';
import htmlStringToElement from './utils/htmlStringToElement';

interface ElementPosition {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

// TODO should we change focus
// TODO factor in stage's padding in tooltip offset from target
// TODO should we make stage into the target for event listeners -- nah
// TODO some target inside stages are given padding in both dimensions and some not
// TODO fix stuff with zIndices
// TODO since we're taking element outside of dom like that, can we preserve reference to the target element
// by linking reference of dummy element to target element?

if(window) {
  window.alert = console.log
}

class Backdrop {

  readonly targetSelector: string;
  private overlay: any;
  private stage: any;
  private targetElementContextStyle: any;
  private targetDummySelector: string = '#lusift-backdrop-target-dummy';

  constructor(targetSelector: string) {
    this.targetSelector = `${targetSelector}:not(${this.targetDummySelector})`;
    this.show();
  }

  private show(): void {
    window.alert('triggering overlay');
    this.addOverlay();
    const targetElement = document.querySelector(this.targetSelector);
    const targetPosition = this.getElementPosition(targetElement);
    this.addTargetDummy();
    this.stageElement(targetElement, targetPosition);
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
    const overlayStyle = {
      background: '#444',
      opacity: '0.5',
      position: 'fixed',
      top: '0',
      left: '0',
      bottom: '0',
      right: '0',
      zIndex: 99998
    }
    this.overlay.style.cssText = styleObjectToString(overlayStyle);

    document.body.appendChild(this.overlay);
    console.log('overlay added');
  }

  private addTargetDummy(): void {
    console.log('adding dummy');

    // add a element of type target's element, and it's css to replace target element
    // change the target element's css to place it on the original cordinates but on top of overlay
    // put things back into place after overlay is triggered close

    const targetElement = document.querySelector(this.targetSelector);
    const targetPosition = this.getElementPosition(targetElement);
    console.log('target position:');
    console.log(targetPosition);

    // Save targetElement style that's being modified to get on stage
    const { position, zIndex, top, left, bottom, right } = targetElement.style;
    this.targetElementContextStyle = { position, zIndex, top, left, bottom, right };

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
    console.log('dummy added');
  }

  private stageElement(targetElement: document.HTMLElement, targetPosition: ElementPosition): void {

    console.log('saved target element:');
    console.log(targetElement)

    this.stage = document.createElement('div');
    this.stage.id='lusift-stage';
    // overlay.appendChild(stage);

    const paddingValue = 10;
    const requiredPadding = paddingValue * 2;

    const stageWidth = (targetPosition.right - targetPosition.left) + (requiredPadding);
    const stageHeight = (targetPosition.bottom - targetPosition.top) + (requiredPadding);

    const stageStyle = {
      //TODO what's the logic to these props
      top: `${targetPosition.top - (requiredPadding / 2)}px`,
      left: `${targetPosition.left - (requiredPadding / 2)}px`,
      bottom: '',
      right: '',
      // TODO should this be absolute
      position: 'absolute',
      width: `${stageWidth}px`,
      height: `${stageHeight}px`,
      backgroundColor: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '99998'
    };
    this.stage.style.cssText = styleObjectToString(stageStyle);
    document.body.appendChild(this.stage);

    const targetElementStyle = {
      ...targetElement.style,
      position: 'relative',
    }
    targetElement.style.cssText = styleObjectToString(targetElementStyle);

    this.stage.appendChild(targetElement);

    console.log('staged');
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
    this.stage.remove();
    console.log('overlay and stage removed')
  }
}

export default Backdrop;
