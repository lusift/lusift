export interface StepActions {
  styleProps: Object;
  closeButton: {
    styleProps: Object;
    disabled: boolean;
  };
  navSection: {
    styleProps: Object;
    nextButton: {
      text: string;
      styleProps: Object;
      disabled: boolean;
    };
    prevButton: {
      text: string;
      styleProps: Object;
      disabled: boolean;
    };
    dismissLink: {
      text: string;
      styleProps: Object;
      disabled: boolean;
    };
  };
}

interface BackdropData {
  color: string;
  opacity: string;
  stageGap: number;
  nextOnOverlayClick?: boolean;
}

let possiblePlacements = <let>['top', 'right', 'bottom', 'left', 'auto'];
possiblePlacements.forEach(placement => {
  possiblePlacements.push(placement + '-start');
  possiblePlacements.push(placement + '-end');
});

const targetPathComparator = <const>['is', 'contains', 'startsWith', 'endsWith', 'regex'];

export interface TooltipData {
  bodyContent: string;
  placement: typeof possiblePlacements[number];
  offset: number[];
  arrow: boolean;
  scrollIntoView: boolean;
  backdrop?: {
    disabled?: boolean;
    color?: string;
    opacity?: string;
    stageGap?: number;
    nextOnOverlayClick?: boolean;
  }
  progressOn?: {
    eventType: string;
    elementSelector: string;
    disabled?: boolean;
  };
}


export interface ModalTarget {
  path: {
    value: string;
    comparator: typeof targetPathComparator[number];
  }
}

export interface HotspotAndTooltipTarget {
  path: {
    value: string;
    comparator: typeof targetPathComparator[number];
  }
  elementSelector: string;
}

export interface Tooltip {
  index: number;
  type: string;
  data: TooltipData;
  target: HotspotAndTooltipTarget;
  actions: StepActions;
  styleProps: Object;
}


export interface GuideType {
  id: string;
  name: string;
  description?: string;
  steps: StepType[];
  doNotResetTrackerOnContentChange: boolean;
  onNext?: Function;
  onPrev?: Function;
  onClose?: Function;
}


export interface TrackingState {
  currentStepIndex: number;
  finished: boolean;
  prematurelyClosed: boolean;
  asyncSteps: {
    [key: number]: {
      toOpen: boolean;
    }
  }
}

export interface Content {
  [guideID: string]: {
    type: string;
    data: GuideType;
  }
}


export interface PopperInstanceType {
  state: Object;
  destroy: () => void,
  forceUpdate: () => void,
  update: () => Promise<Object>,
  setOptions: (
    options: Object | ((Object) => Object)
  ) => Promise<Object>,
}

export interface Hotspot{
  index: number;
  type: string;
  target: HotspotAndTooltipTarget,
  beacon: {
    placement: {
      top: number;
      left: number;
    },
    size: number;
    color: string;
    type: string;
  },
  tip: {
    data: {
      placement: typeof possiblePlacements[number];
      arrow: boolean;
      bodyContent: string;
    },
    styleProps: object;
  },
  async: boolean;
}

export interface Modal {
  index: number;
  type: string;
  target: ModalTarget;
  data: {
    bodyContent: string;
  };
  closeButton: {
    disabled: boolean;
    escToClose: boolean;
    clickOutsideToClose: boolean;
  }
}

export type StepType = Tooltip | Hotspot | Modal;

export interface ElementPosition {
  top: number;
  left: number;
  right: number;
  bottom: number;
  height: number;
  width: number;
}
