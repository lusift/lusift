
export interface StepActions {
  styleProps: Object;
  closeButton: {
    styleProps: Object;
    disable: boolean;
  };
  navSection: {
    styleProps: Object;
    nextButton: {
      text: string;
      styleProps: Object;
      disable: boolean;
    };
    prevButton: {
      text: string;
      styleProps: Object;
      disable: boolean;
    };
    dismissLink: {
      text: string;
      styleProps: Object;
      disable: boolean;
    };
  };
}

interface BackdropData {
  color: string;
  opacity: string;
  stageGap: number;
  nextOnOverlayClick: boolean;
}

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

export interface TooltipTarget {
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
  target: TooltipTarget;
  actions: StepActions;
  styleProps: Object;
}


export interface GuideType {
  id: string;
  name: string;
  description: string;
  steps: Tooltip[];
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



export interface HotspotData {
  index: number;
  type: string;
  target: {
    path: {
      value: string;
      comparator: string;
    },
    elementSelector: string;
  },
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
  async: {
    following: boolean;
    leading: boolean;
  }
}
