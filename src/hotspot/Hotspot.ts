import { document, window } from 'global';
import createHotspotTooltip from './createHotspotTooltip';
import createBeacon from './createBeacon';
import { getElementPosition, getStepUID, changeAsyncStepStatus } from '../common/utils';
import { Hotspot as HotspotData } from '../common/types';


class Hotspot {
  private tipID: string;
  private tippyInstance: any;
  private targetElement: document.HTMLElement;
  readonly data: HotspotData;
  private beaconID: string;

  constructor({ data, guideID }) {
    console.log(data);
    this.data = data;
    const { index, type, target } = data;
    this.tipID = getStepUID({guideID, type, index});
    this.beaconID = getStepUID({guideID, type:'beacon', index});
    this.targetElement = document.querySelector(target.elementSelector);
    this.addBeacon();
  }

  private addBeacon(): void {
    console.log('adding beacon');
    let {
      top: targetTop,
      left: targetLeft,
      width: targetWidth,
      height: targetHeight
    } = getElementPosition(this.targetElement);
    const targetPosition = { targetTop, targetLeft, targetWidth, targetHeight };

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

    if(activeHotspot && (this.data.index !== activeHotspot.data.index)){
      window.Lusift.activeHotspot.hideTooltip();
    }

    if(!this.tippyInstance){
      // if it was never initiated
      this.tippyInstance = createHotspotTooltip({
        remove: this.removeAndCloseAsync.bind(this),
        uid: this.tipID,
        target,
        styleProps,
        data
      });
      window.Lusift.activeHotspot = this;
    }  else if(this.tippyInstance.state.isDestroyed) {
      console.warn('Uh... but it doesn\'t exist');
      // if it's removed

    } else if(this.tippyInstance.state.isShown) {
      this.hideTooltip();
    } else if(this.tippyInstance) {
      // if it's hidden
      this.tippyInstance.show();
      window.Lusift.activeHotspot = this;
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
    console.log(`Removing id: ${this.data.index} hotspot`);
    if(this.tippyInstance) {
      this.tippyInstance.unmount();
      this.tippyInstance.destroy();
    } else {
      console.log('Hotspot closed without ever opening');
    }
    const beaconElement = document.getElementById(this.beaconID);
    if (beaconElement) {
      beaconElement.parentElement.remove();
      window.Lusift.activeHotspot = null;
    }
  }

  private removeAndCloseAsync(): void {
    this.remove();
    this.changeAsyncStepStatus(false);
  }
}

export default Hotspot;
