import { document, window } from 'global';
import createHotspotTooltip from './createHotspotTooltip';

// TODO bug - beacon is fixed in position and not stuck to the target
// TODO check for target and screen resize here too like we do in Backdrop
// TODO There're two types of beacon - pulsing and question mark (fa-question-circle)
// TODO hotspots can trigger either modal or tooltips
// TODO make hotspot serially triggering, like tooltips, for now

const hotspot1 = {
  index: 8,
  type: 'hotspot',
  target: {
    path: {
      value: '/lusift/nps',
      comparator: 'is'
    },
    elementSelector: 'h2',
  },
  beacon: {
    placement: {
      top: 90,
      left: 90,
    },
    size: 1,
    color: '',
    type: 'pulsing'
  },
  tip: {
    data: {
      placement: 'bottom',
      arrow: true,
      bodyContent: '<p style="color:blue">Hotspot 1 body</p>',
    },
    styleProps: {
      border: '2px solid green',
    }
  },
}

const placement = {
  top: 90,
  left: 90,
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
    window.setTimeout(this.addBeacon.bind(this), 1000);
    // this.addBeacon();
  }

  private attemptShow(): void {

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
    /* targetTop=10;
    targetLeft=1;
    targetHeight=1;
    targetWidth=2; */

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
      cursor: pointer;
      -webkit-animation-delay: 1s;
              animation-delay: 1s;
              /*
      top: ${targetTop+(top*(targetHeight/100))}px;
      left: ${targetLeft+(left*(targetWidth/100))}px;
      */
      top: ${(top/100)*targetHeight}px;
      left: ${(left/100)*targetWidth}px;
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
    } else if(this.tippyInstance) {
      // if it's hidden
      this.tippyInstance.show();
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
