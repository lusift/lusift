import { document, window } from 'global';
import { styleObjectToString, getStepUID, onElementResize, getElementPosition } from './utils/';

const roundNum = (value: number, decimalPlaces: number=2) => {
  return Math.round((value + Number.EPSILON) * Math.pow(10, decimalPlaces)) / (Math.pow(10, decimalPlaces));
}

const areNumbersEqual = (num1: number, num2: number): boolean => {

  let num1Precision = num1.toString().substring(num1.toString().indexOf(".")).length-1;
  if(num1.toString().indexOf('.')==-1) num1Precision=0;

  let num2Precision = num2.toString().substring(num2.toString().indexOf(".")).length-1;
  if(num2.toString().indexOf('.')==-1) num2Precision=0;
  let decimalPlaces = Math.min(num1Precision, num2Precision);
  if(decimalPlaces>2) {
    decimalPlaces = 1; //most reliable precision
  }
  /* console.log(num1, num2)
  console.log(num1Precision, num2Precision, decimalPlaces);

  console.log(roundNum(num1, decimalPlaces), roundNum(num2, decimalPlaces)); */

  return roundNum(num1, decimalPlaces) === roundNum(num2, decimalPlaces);
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
  private dummyElement: document.HTMLElement;
  private toStopOverlay: boolean;
  private resizeObservers: any[] = [];

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
    /* document.body.style.height='1000px'
    document.body.style.width='1000px' */
    this.addBackdop();

    this.dummyElement = document.createElement('div');
    this.dummyElement.id = 'lusift-backdrop-dummy';
    document.body.appendChild(this.dummyElement);

    this.resetBackdrop = this.resetBackdrop.bind(this);
    window.addEventListener('resize', this.resetBackdrop, true);
    // remove focus from focused element
    document.activeElement.blur();

    // HACK
    this.dummyElement.addEventListener('click', () => {
      window.removeEventListener('resize', this.resetBackdrop, true);
    }, true);

    this.resizeObservers.push(onElementResize(
      document.querySelector(`.${this.overlaySelectorClass}`),
      this.resetBackdrop
    ));
    this.resizeObservers.push(onElementResize(
      document.body,
      this.resetBackdrop
    ));
  }

  private resetBackdrop(): void {
    window.setTimeout(() => {
      if(this.toStopOverlay) return console.log('no showing overlay anymore');
      this.removeOverlay();
      this.addBackdop();
    }, 700);
  }

  private getScreenDimensions(): { screenWidth: number; screenHeight: number } {
    const { height, width } = getElementPosition(document.documentElement);

    return {
      screenWidth: width,
      screenHeight: height
    }
  }

  private addBackdop(): void {
   /* document.documentElement.style.overflow = 'hidden';
   document.body.scroll = "no"; */
    const targetElement = document.querySelector(this.targetSelector);
    const padding = this.data.stageGap;

    const { screenHeight, screenWidth } = this.getScreenDimensions();

    const targetPosition = getElementPosition(targetElement);

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
    const { height: hTopHeight, width: hTopWidth } = getElementPosition(hTop);
    const { height: hBottomHeight, width: hBottomWidth } = getElementPosition(hBottom);
    const vLeftWidth = getElementPosition(vLeft).width;
    const vRightWidth = getElementPosition(vRight).width;


    const overlaySumWidth = hTopWidth+vLeftWidth+vRightWidth;
    const overlaySumHeight = hTopHeight+hBottomHeight+targetPosition.height+2*padding;

    /* console.log(screenWidth, overlaySumWidth);
    console.log(screenHeight, overlaySumHeight); */

    if(!areNumbersEqual(screenWidth, overlaySumWidth) || !areNumbersEqual(screenHeight, overlaySumHeight)){
      this.resetBackdrop();
    }
  }

  private removeOverlay(): void {
    document.querySelectorAll(`.${this.overlaySelectorClass}`)
    .forEach((el: document.HTMLElement) => {
      if(el) el.remove();
    });

    const targetElement = document.querySelector(this.targetSelector);
    if(targetElement) targetElement.classList.remove(this.stagedTargetClass);
    /* document.documentElement.style.overflow = 'scroll';
    document.body.scroll = "yes"; */
  }

  public remove(): void {
    this.removeOverlay();
    this.toStopOverlay=true;
    // remove event listeners
    this.dummyElement.click();
    this.dummyElement.remove();
    this.resizeObservers.forEach(ro => ro.disconnect());
    // console.log('overlay and stage removed')
  }
}

export default Backdrop;
