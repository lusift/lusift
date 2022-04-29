import { document, window } from 'global';
import createHotspotTooltip from './createHotspotTooltip';
import createBeacon from './createBeacon';
import {
  getElementPosition,
  getStepUID,
  changeAsyncStepStatus,
  onElementResize
} from '../common/utils';
import { Hotspot as HotspotData } from '../common/types';

// TODO_: In case of customizing hotspot's beacon, we can just have a beaconElement property
class Hotspot {
  private tipID: string;
  private tippyInstance: any;
  private targetElement: HTMLElement;
  readonly data: HotspotData;
  private beaconID: string;
  private resizeObservers: any[] = [];

  constructor({ data, guideID }) {
    console.log(data);
    this.data = data;
    const { index, type, target } = data;
    this.tipID = getStepUID({ guideID, type, index });
    this.beaconID = getStepUID({
      guideID,
      type:'beacon',
      index
    });
    this.targetElement = document.querySelector(
      target.elementSelector
    );
    this.addBeacon();

    // reposition beacon on body and targetElement resize
    this.resizeObservers.push(onElementResize(
      document.body,
      this.repositionBeacon.bind(this)
    ));
    this.resizeObservers.push(onElementResize(
      this.targetElement,
      this.repositionBeacon.bind(this)
    ));
  }

  private repositionBeacon(): void {
    this.remove();
    this.tippyInstance = null;
    this.addBeacon();
    console.log('reset beacon position');
  }

  private addBeacon(): void {
    console.log('adding beacon');
    let {
      top: targetTop,
      left: targetLeft,
      width: targetWidth,
      height: targetHeight
    } = getElementPosition(this.targetElement);
    const targetPosition = {
      targetTop,
      targetLeft,
      targetWidth,
      targetHeight
    };

    const beaconData = this.data.beacon;

    createBeacon({
      targetPosition,
      beaconData,
      beaconID: this.beaconID,
      toggleTooltip: this.toggleTooltip.bind(this)
    });
  }

  private toggleTooltip(): any {
    // console.log('toggle tooltip');

    const target = document.getElementById(this.beaconID);
    const { data, styleProps } = this.data.tip;
    const activeHotspot = window.Lusift.activeHotspot;
    const Lusift = window['Lusift'];

    if(activeHotspot && (this.data.index !== activeHotspot.data.index)){
      Lusift.activeHotspot.hideTooltip();
    }

    // do not allow async step to close in dev mode
    const isDevMode = !Boolean(Lusift.activeGuide);
    let removeMethod = isDevMode?
    Lusift.close : this.removeAndCloseAsync.bind(this);

    if(!this.tippyInstance){
      // if it was never initiated
      this.tippyInstance = createHotspotTooltip({
        remove: removeMethod,
        uid: this.tipID,
        index: this.data.index,
        target,
        styleProps,
        data,
      });
      Lusift.activeHotspot = this;
    }  else if(this.tippyInstance.state.isDestroyed) {
      console.error(
        'Uh... but it doesn\'t exist. unexpected'
      );
      // if it's removed

    } else if(this.tippyInstance.state.isShown) {
      this.hideTooltip();
    } else if(this.tippyInstance) {
      // if it's hidden
      this.tippyInstance.show();
      Lusift.activeHotspot = this;
    }
  }

  public hideTooltip() {
    this.tippyInstance.hide();
      window.Lusift.activeHotspot = null;
  }

  private changeAsyncStepStatus(toOpen: boolean): void {
    if(!this.data.async) return;
    changeAsyncStepStatus(this.data.index, toOpen);
  }

  private remove(): void {
    console.log(
      `Removing id: ${this.data.index} hotspot`
    );
    if(this.tippyInstance) {
      if(this.tippyInstance.state.isDestroyed) {
        console.log(
          'Hotspot\'s tooltip is already destroyed'
        );
      }
      this.tippyInstance.unmount();
      this.tippyInstance.destroy();
    } else {
      console.log(
        'Hotspot closed without ever opening'
      );
    }
    const beaconElement = document.getElementById(this.beaconID);
    if (beaconElement) {
      beaconElement.parentElement.remove();
      window.Lusift.activeHotspot = null;
    }
  }

  private removeResizeObservers(): void {
    this.resizeObservers.forEach(ro => ro.disconnect());
  }

  private removeAndCloseAsync(): void {
    this.remove();
    this.changeAsyncStepStatus(false);
    this.removeResizeObservers();
  }
}

export default Hotspot;
