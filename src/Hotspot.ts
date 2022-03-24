import { document, window } from 'global';
import createHotspotTooltip from './createHotspotTooltip';

const placement = {
  top: 85,
  left: 95,
  size: 1,
  color: '',
  animation: false,
}

const tooltipData = {
  arrow: true,
  bodyContent: undefined,
  offset: [0,10],
  styleProps: {},
  placement: 'bottom'
}

class Hotspot {
  private uid: string;
  private elementSelector: string;
  private tippyInstance: any;
  private styleProps: any = {};
  private targetElement: document.HTMLElement;
  private beaconSelector: document.HTMLElement;

  constructor() {
    this.uid = 'some-id-here';
    this.elementSelector = 'h2';
    this.targetElement = document.querySelector(this.elementSelector);
    console.log(this.targetElement)
    this.addBeacon();
  }

  public attemptShow(): void {

  }

  private addBeacon(): void {
    console.log('adding beacon');
    let { top: targetTop, left: targetLeft, width: targetWidth, height: targetHeight } = this.getElementPosition(this.targetElement);
    const beaconContainer = document.createElement('div');
    beaconContainer.style.position="absolute";
    beaconContainer.style.top=`${targetTop}px`;
    beaconContainer.style.left=`${targetLeft}px`;
    beaconContainer.classList.add('lusift-beacon-container');

    const { top, left, animation } = placement;
    const beaconID = `lusift-beacon-${this.uid}`;
    this.beaconSelector = `#${beaconID}`;

    beaconContainer.innerHTML = `
    <style>
    #${beaconID} {
      background-color: #b9f;
      border-radius: 50%;
      position: absolute;
      z-index: 20;
      width: 13px;
      height: 13px;
      -webkit-animation: shine 2s ease-in-out infinite;
              animation: shine 2s ease-in-out infinite;
      position: fixed;
      cursor: pointer;
      -webkit-animation-delay: 1s;
              animation-delay: 1s;
      top: ${targetTop+(top*targetHeight/100)}px;
      left: ${targetLeft+(left*targetWidth/100)}px;
    }

    ${animation? `

    @-webkit-keyframes shine {
      0%, 20% {
        box-shadow: 0px 0px 0px 0px rgba(187, 153, 255, 0.49);
      }
      100% {
        box-shadow: 0px 0px 0px ${40*placement.size}px rgba(0, 0, 0, 0);
      }
    }

    @keyframes shine {
      0%, 20% {
        box-shadow: 0px 0px 0px 0px rgba(187, 153, 255, 0.49);
      }
      100% {
        box-shadow: 0px 0px 0px ${40*placement.size}px rgba(0, 0, 0, 0);
      }
    }`: ''
  }
    </style>
    <div id="${beaconID}"></div>
    `;
    document.body.appendChild(beaconContainer);
    document.getElementById(beaconID).addEventListener('click', () => this.toggleTooltip.bind(this)());
  }

  private toggleTooltip(): any {
    console.log('toggle tooltip')

    const { arrow, bodyContent, offset, styleProps, placement } = tooltipData;
    const target = document.querySelector(this.beaconSelector);

    if(!this.tippyInstance){
      // if it was never initiated
      this.tippyInstance = createHotspotTooltip({
        remove: this.remove.bind(this),
        uid: this.uid,
        target,
        styleProps,
        arrow,
        bodyContent,
        placement,
        offset,
      });
    }  else if(this.tippyInstance.state.isDestroyed) {
      // if it's removed

    } else if(this.tippyInstance.state.isShown) {
      this.tippyInstance.hide();
      // if it's shown
    } else if(this.tippyInstance) {
      this.tippyInstance.show();
      // if it's hidden
    }
  }

  private remove(): void {
    //
    this.tippyInstance.unmount();
    this.tippyInstance.destroy();
    document.querySelector(this.beaconSelector).remove();
  }

  private getElementPosition(element: document.HTMLElement): any {
    const documentElement = document;
    const body = document.body;

    const scrollTop = window.pageYOffset || documentElement.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || documentElement.scrollLeft || body.scrollLeft;
    const elementRect = element.getBoundingClientRect();

    const position = {
      top: elementRect.top + scrollTop,
      left: elementRect.left + scrollLeft,
      right: elementRect.left + scrollLeft + elementRect.width,
      bottom: elementRect.top + scrollTop + elementRect.height,
      height: elementRect.height,
      width: elementRect.width
    };
    return position;
  }

  private show(): void {

  }
}

export default Hotspot;
