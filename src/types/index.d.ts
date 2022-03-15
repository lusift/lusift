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
      title: string;
      arrow: boolean;
    };
    placement: string;
  }[];
}


export interface Content {
  [guideID: string]: {
    type: string;
    data: GuideType;
  }
}
