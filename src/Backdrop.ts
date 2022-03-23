import { document, window } from 'global';
import { styleObjectToString, getStepUID, onElementResize } from './utils/';

interface ElementPosition {
  top: number;
  left: number;
  right: number;
  bottom: number;
  height: number;
  width: number;
}

// TODO should we change focus on page
// TODO fix stuff with zIndices
// 2147483647
// TODO wait for all fonts to load and such before executing Lusift,
// TODO only one overlay on the screen at a time

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
  readonly stagedTargetClass: string;
  public overlaySelectorClass: string = 'lusift-overlay';
  // private data: BackdropData;
  private data: any;

  constructor({
    targetSelector,
    uid,
    guideID,
    index,
    data
  }: BackdropParameters) { //BackdropParameters
    uid = uid || getStepUID({ guideID, index, type: 'backdrop' });
    this.stagedTargetClass = `${uid}__target`;

    this.data = {
      ...defaultBackdropData,
      ...data
    }
    this.targetSelector = targetSelector;
    this.addBackdop();
    const targetElement = document.querySelector(this.targetSelector);

    window.addEventListener('resize', this.resetBackdrop.bind(this));
    onElementResize(targetElement, this.resetBackdrop.bind(this));
  }

  private resetBackdrop(): void {
    window.setTimeout(() => {
      this.remove();
      this.addBackdop();
    }, 500);
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
      height: elementRect.height,
      width: elementRect.width
    };
    return position;
  }

  private getScreenDimensions(): { screenWidth: number; screenHeight: number } {

    return {
      screenWidth: window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth,

      screenHeight: window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight
    }
  }

  private addBackdop(): void {
    // TODO block scrolling
    const targetElement = document.querySelector(this.targetSelector);
    const padding = this.data.stageGap;

    const { screenHeight, screenWidth } = this.getScreenDimensions();

    const targetPosition = this.getElementPosition(targetElement);

    const hTop = document.createElement('div');
    hTop.id = 'hTop';
    const hBottom = document.createElement('div');
    hBottom.id = 'hBottom';

    const vLeft = document.createElement('div');
    vLeft.id = 'vLeft';
    const vRight = document.createElement('div');
    vRight.id = 'vRight';

    const overlayStyle = {
      opacity: '0.5',
      background: '#444',
      position: 'absolute',
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
      zIndex: 99998,
      border: '1px solid transparent',
    }

    hTop.style.cssText = styleObjectToString({
      ...overlayStyle,
      height: `${targetPosition.bottom - targetPosition.height - padding}px`,
      width: `${targetPosition.right - targetPosition.left + 2*padding}px`,
      left: `${targetPosition.left - padding}px`,
      bottom: ''
    });


    hBottom.style.cssText = styleObjectToString({
      ...overlayStyle,
      height: `${screenHeight - (targetPosition.top + targetPosition.height + padding)}px`,
      width: `${targetPosition.right - targetPosition.left + 2*padding}px`,
      left: `${targetPosition.left - padding}px`,
      top: ''
    });

    vLeft.style.cssText = styleObjectToString({
      ...overlayStyle,
      width: `${targetPosition.right - targetPosition.width - padding}px`,
    });
    vRight.style.cssText = styleObjectToString({
      ...overlayStyle,
      width: `${screenWidth - (targetPosition.left+targetPosition.width) - padding}px`,
      left: ''
    });

    [hTop, hBottom, vLeft, vRight].forEach(el => {
      el.classList.add(this.overlaySelectorClass);
      document.body.appendChild(el);
    });
    targetElement.classList.add(this.stagedTargetClass);

    // See that the overlay isn't glitchy, reset if it is
    const { height: hTopHeight, width: hTopWidth } = this.getElementPosition(hTop);
    const { height: hBottomHeight, width: hBottomWidth } = this.getElementPosition(hBottom);
    const vLeftWidth = this.getElementPosition(vLeft).width;
    const vRightWidth = this.getElementPosition(vRight).width;

    const roundNum = (value: number, decimalPlaces: number) => {
      return Number(Math.round(parseFloat(value + 'e' + decimalPlaces)) + 'e-' + decimalPlaces)
    }

    const overlaySumWidth = roundNum(hTopWidth+vLeftWidth+vRightWidth, 4);
    const overlaySumHeight = roundNum((hTopHeight+hBottomHeight+targetPosition.height+2*padding), 4);

    /* console.log(screenWidth, overlaySumWidth);
    console.log(screenHeight, overlaySumHeight); */

    if(screenWidth !== overlaySumWidth || screenHeight !== overlaySumHeight){
      this.resetBackdrop();
    }
  }

  public removeOverlay(): void {
    document.querySelectorAll(`.${this.overlaySelectorClass}`)
    .forEach((el: document.HTMLElement) => el.remove());

    const targetElement = document.querySelector(this.targetSelector);
    targetElement.classList.remove(this.stagedTargetClass);
  }

  public remove(): void {
    this.removeOverlay();

    const targetElement = document.querySelector(this.targetSelector);
    // remove event listeners
    window.removeEventListener('resize', this.resetBackdrop);
    // onElementResize(targetElement, this.resetBackdrop);
    // console.log('overlay and stage removed')
  }
}

export default Backdrop;
