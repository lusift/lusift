import { document, window } from 'global';
import createHotspotTooltip from './createHotspotTooltip';
import createBeacon from './createBeacon';
import { getElementPosition, getStepUID } from './utils';
import { Hotspot as HotspotData } from './types';
import { loadState, saveState } from './localStorage';

// TODO check for target and screen resize here too like we do in Backdrop
// TODO There're two types of beacon - pulsing and question mark (fa-question-circle)
// TODO async steps' close status need to be tracked. if AS leads to SS and then index progresses from there ---
// TODO fix absolute positioned element not taking events
//

const hotspot1: HotspotData = {
  index: 7,
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
    type: 'pulsing',
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
  async: true
}

class Hotspot {
  private tipID: string;
  private tippyInstance: any;
  private targetElement: document.HTMLElement;
  private data: HotspotData;
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

    createBeacon({ targetPosition, beaconData, beaconID: this.beaconID, toggleTooltip: this.toggleTooltip.bind(this) });
    this.changeAsyncStepStatus(true);
    /* document.getElementById(this.beaconID).parentElement.addEventListener('click', () => {
      console.log('tooltip!!')
      this.toggleTooltip.bind(this)()
    }, false); */
  }

  private toggleTooltip(): any {
    console.log('toggle tooltip')

    const target = document.getElementById(this.beaconID);
    const { data, styleProps } = this.data.tip;

    if(!this.tippyInstance){
      // if it was never initiated
      this.tippyInstance = createHotspotTooltip({
        remove: window.Lusift.next,
        uid: this.tipID,
        target,
        styleProps,
        data
      });
    }  else if(this.tippyInstance.state.isDestroyed) {
      console.warn('Uh... but it doesn\'t exist');
      // if it's removed

    } else if(this.tippyInstance.state.isShown) {
      this.tippyInstance.hide();
    } else if(this.tippyInstance) {
      // if it's hidden
      this.tippyInstance.show();
    }
  }

  private changeAsyncStepStatus(toOpen: boolean): void {
    if(!this.data.async) return;

    const exisitingState = loadState();
    saveState({
      ...exisitingState,
      [window.activeGuideID]: {
        ...exisitingState[window.activeGuideID],
        trackingState: {
          ...exisitingState[window.activeGuideID].trackingState,
          asyncSteps: {
            ...exisitingState[window.activeGuideID].asyncSteps,
            [this.data.index]: {
              toOpen
            }
          }
        }
      }
    });
  }

  private remove(): void {
    if(this.tippyInstance) {
      this.tippyInstance.unmount();
      this.tippyInstance.destroy();
    } else {
      console.log('Hotspot closed without ever opening');
    }
    document.getElementById(this.beaconID).parentElement.remove();
    this.changeAsyncStepStatus(false);
  }
}

export default Hotspot;
