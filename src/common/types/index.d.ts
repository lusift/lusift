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

export type BackdropParameters = BackdropForTooltipParameters & BackdropAsStepParameters;

export interface TooltipData {
  bodyContent: string;
  placement: any; // Placement type from popper or manually
  offset: number[];
  arrow: boolean;
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
    comparator: string;
  }
}

export interface HotspotAndTooltipTarget {
  path: {
    value: string;
    comparator: string;
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

export type StepType = Tooltip | HotspotData;

export interface GuideType {
  id: string;
  name: string;
  description?: string;
  steps: StepType[];
  doNotResetTrackerOnContentChange: boolean;
}


export interface TrackingState {
  activeStep: number;
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
    onNext?: Function;
    onPrev?: Function;
    onClose?: Function;
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
      placement: string;
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
  }
}

export interface ElementPosition {
  top: number;
  left: number;
  right: number;
  bottom: number;
  height: number;
  width: number;
}
