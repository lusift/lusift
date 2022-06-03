import { Content } from '../common/types';
import { mergeDeep } from '../common/utils';
import { isObject } from '../common/utils/isOfType';

const defaultTooltipActions = {
  styleProps: {},
  closeButton: {
    styleProps: {},
    disabled: false,
  },
  navSection: {
    styleProps: {},
    nextButton: {
      text: 'next',
      styleProps: {
      },
      disabled: false,
    },
    prevButton: {
      text: 'prev',
      styleProps: {},
      disabled: false,
    },
    dismissLink: {
      text: 'skip this',
      styleProps: {},
      disabled: false,
    }
  },
}

const defaultTooltipBackdrop = {
  disabled: false,
  color: '#444',
  opacity: '0.5',
  stageGap: 5,
  nextOnOverlayClick: false
}

const tooltipArrowDefaultSize = 12;
const tooltipArrowSizeScale = 1;
const defaultTooltipOffset = [tooltipArrowSizeScale*tooltipArrowDefaultSize, 0]; // x needs to be size of arrow + backdrop gap

const defaultTooltip = {
  target: {
    path: {
      comparator: 'is'
    },
  },
  data: {
    placement: {
      position: 'bottom',
      orientation: 'auto'
    },
    arrow: true,
    backdrop: defaultTooltipBackdrop,
    offset: defaultTooltipOffset
  },
  actions: defaultTooltipActions,
  styleProps: {
  }
}

const defaultHotspot = {
  target: {
    path: {
      comparator: 'is'
    },
  },
  beacon: {
    placement: {
      top: 90,
      left: 90,
    },
    size: 1,
    color: '', //what's this?
    type: 'pulsing'
  },
  tip: {
    data: {
      placement: 'bottom',
      arrow: true,
    },
    styleProps: {
    }
  },
  async: true
}

const defaultModal = {
  target: {
    path: {
      comparator: 'is'
    }
  },
  closeButton: {
    styleProps: {},
    disabled: true,
  },
  data: {
    escToClose: false,
    clickOutsideToClose: true
  },
  overlay: {
    styleProps: {},
  },
  styleProps: {}
}

const defaultGuideData = {
  name: '',
  description: '',
  steps: [],
  onNext: () => {},
  onPrev: () => {},
  onClose: () => {}
}

function removeUndefinedFields(obj) {
  for (var key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
      continue;
    }
    if (obj[key] && typeof obj[key] === "object") {
      removeUndefinedFields(obj[key]);
    }
  }
  return obj;
}

let defaults = {
  tooltip: defaultTooltip,
  hotspot: defaultHotspot,
  modal: defaultModal,
}

export interface DefaultTooltip {
  target: {
    path: {
      comparator: string,
      value: string
    }
  },
  data: {
    placement: string,
    arrow: boolean,
    backdrop: {
      disabled: boolean,
      color: string,
      opacity: string,
      stageGap: number,
      nextOnOverlayClick: boolean
    }
  },
  actions: {
    styleProps: {},
    closeButton: {
      styleProps: {},
      disabled: boolean,
    },
    navSection: {
      styleProps: {},
      nextButton: {
        text: string,
        styleProps: {},
        disabled: boolean,
      },
      prevButton: {
        text: string,
        styleProps: {},
        disabled: boolean,
      },
      dismissLink: {
        text: string,
        styleProps: {},
        disabled: boolean,
      }
    }
  }
}

export interface DefaultHotspot {
  target: {
    path: {
      comparator: string,
      value: string
    }
  },
  beacon: {
    placement: {
      top: number,
      left: number,
    },
    size: number,
    color: string,
    type: string
  },
  tip: {
    data: {
      placement: string,
      arrow: boolean,
    },
    styleProps: {},
  },
  async: boolean
}

export interface DefaultModal {
  target: {
    path: {
      comparator: string,
      value: string
    }
  },
  closeButton: {
    styleProps: {},
    disabled: boolean,
  },
  data: {
  }
}

function overrideProps(target, source) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if ((key in target))
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}


export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

export interface ContentDefaults {
  tooltip: DefaultTooltip,
  hotspot: DefaultHotspot,
  modal: DefaultModal,
}

export default function combineContentWithDefaults(content, contentDefaults?: DeepPartial<ContentDefaults>): Content {
  content = removeUndefinedFields(content);

  // TODO: combine inputDefaults with defaults, but only for properties that exist on defaults

  if (contentDefaults) {
    defaults = overrideProps(defaults, contentDefaults);
  }

  Object.keys(content).forEach((guideID) => {
    const guideData = content[guideID].data;

    let completedGuideData = mergeDeep(defaultGuideData, guideData);
    let steps = completedGuideData.steps;
    steps = steps.map((step, index) => {
      let completedStep = step;
      if (step.type === 'tooltip') {
        completedStep = mergeDeep(defaults.tooltip, step);
      } else if (step.type === 'hotspot') {
        completedStep = mergeDeep(defaults.hotspot, step);
      } else if (step.type === 'modal') {
        completedStep = mergeDeep(defaults.modal, step);
      }
      return completedStep;
    });
    completedGuideData.steps = steps;
    content[guideID].data = completedGuideData;
  });
  return content;
}
