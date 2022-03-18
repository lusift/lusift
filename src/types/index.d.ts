// TODO merge GuideType with TooltipTarget and TooltipData to avoid duplication
export interface GuideType {
  id: string;
  name: string;
  description: string;
  steps: {
    index: number;
    type: string;
    target: {
      path: {
        value: string;
        comparator: string;
      }
      elementSelector: string;
    };
    data: {
      placement: any;
      bodyContent: string;
      arrow: boolean;
    };
  }[];
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

export interface TooltipData {
  bodyContent: string;
  placement: any; // Placement type from popper or manually
  arrow: boolean;
  progressOn?: {
    eventType: string;
    elementSelector: string;
    disabled?: boolean;
  }
}


export interface TooltipTarget {
  path: {
    value: string;
    comparator: string;
  }
  elementSelector: string;
}
