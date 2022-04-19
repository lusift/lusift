import { document, window } from 'global';
import {
  styleObjectToString,
  getStepUID,
  onElementResize,
  getElementPosition,
  roundNum,
  addFocusTrap
} from '../common/utils/';
import { BackdropData, BackdropParameters } from '../common/types';


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

// TODO: Make this a cleaner class
// TODO: Occupy the entire screen even when the document height is smaller than the window height

class Backdrop {

  private targetSelector: string;
  readonly stagedTargetClass: string;
  public overlaySelectorClass: string = 'lusift-overlay';
  private data: any;
  private toStopOverlay: boolean;
  private resizeObservers: any[] = [];
  private focusTrap: any;

  // TODO types here
  constructor({
    targetSelector,
    uid,
    guideID,
    index,
    data
  }: any) { //BackdropParameters
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

    this.resetBackdrop = this.resetBackdrop.bind(this);

    // trap focus inside tooltip
    this.focusTrap = addFocusTrap({
      target: ['.lusift > .tooltip', this.targetSelector],
      escToClose: false,
      clickOutsideToClose: false
    });

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
      // hack to intervene in the event backdrop has already been closed
      if(this.toStopOverlay) return console.log('This overlay instance should be removed');
      this.removeOverlay();
      this.addBackdop();
    }, 500);
  }

  private getDocumentDimensions(): { documentWidth: number; documentHeight: number } {
    const { height, width } = getElementPosition(document.documentElement);

    return {
      documentWidth: width,
      documentHeight: height
    }
  }

  private addBackdop(): void {
   /* document.documentElement.style.overflow = 'hidden';
   document.body.scroll = "no"; */
    const targetElement = document.querySelector(this.targetSelector);
    const padding = this.data.stageGap;

    const { documentHeight, documentWidth } = this.getDocumentDimensions();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // compare the document height and width to the viewport height and width (rounded up)

    console.log(documentHeight, documentWidth);

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
      height: `${documentHeight - (targetPosition.top + targetPosition.height + padding)}px`,
      width: `${targetPosition.right - targetPosition.left + 2*padding}px`,
      left: `${targetPosition.left - padding}px`,
      top: `${targetPosition.bottom + padding}px`
    });

    vLeft.style.cssText = styleObjectToString({
      ...overlayStyle,
      width: `${targetPosition.left - padding}px`,
      height: `${documentHeight}px`,
      right: ''
    });
    vRight.style.cssText = styleObjectToString({
      ...overlayStyle,
      width: `${documentWidth - (targetPosition.left+targetPosition.width) - padding}px`,
      height: `${documentHeight}px`,
      bottom: '0px',
      left: ''
    });

    // TODO: Modify overlay elements' css for when
    // -- viewportHeight greater than documentHeight
    // -- viewportWidth greater than documentWidth (rounded up)

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

    if(!areNumbersEqual(documentWidth, overlaySumWidth) || !areNumbersEqual(documentHeight, overlaySumHeight)){
      this.resetBackdrop();
    }
  }

  private removeOverlay(): void {
    // NOTE: Do we really need to be checking if element exists before removing?
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
    console.log('removing overlay');
    this.removeOverlay();
    this.toStopOverlay=true;
    // remove event listeners
    this.resizeObservers.forEach(ro => ro.disconnect());
    if (this.focusTrap){
      this.focusTrap.deactivate();
    }
    // console.log('overlay and stage removed')
  }
}

export default Backdrop;
