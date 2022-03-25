import { document, window } from 'global';
import createHotspotTooltip from './createHotspotTooltip';
import createBeacon from './createBeacon';
import { styleObjectToString } from './utils';

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

class Hotspot {
  private uid: string;
  private elementSelector: string;
  private tippyInstance: any;
  private targetElement: document.HTMLElement;
  private beaconSelector: string;

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
    let {
      top: targetTop,
      left: targetLeft,
      width: targetWidth,
      height: targetHeight
    } = this.getElementPosition(this.targetElement);
    const targetPosition = { targetTop, targetLeft, targetWidth, targetHeight };

    const beaconID = `lusift-beacon-${this.uid}`;
    this.beaconSelector = `#${beaconID}`;
    const beaconData = hotspot1.beacon;

    createBeacon({ targetPosition, beaconData, beaconID });

    document.getElementById(beaconID).addEventListener('click', () => this.toggleTooltip.bind(this)());
  }

  private toggleTooltip(): any {
    console.log('toggle tooltip')

    const target = document.querySelector(this.beaconSelector);
    const { data, styleProps } = hotspot1.tip;

    if(!this.tippyInstance){
      // if it was never initiated
      this.tippyInstance = createHotspotTooltip({
        remove: this.remove.bind(this),
        uid: this.uid,
        target,
        styleProps,
        data
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
