import { Content, DeepPartial } from '../common/types';
import { ContentDefaults } from './types';
import { mergeDeep } from '../common/utils';
import { isObject } from '../common/utils/isOfType';

const defaultTooltipActions = {
  styleProps: {},
  closeButton: {
    styleProps: {},
    disabled: false,
  },
  navSection: {
    disabled: false,
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

const defaultTooltipOffset = [0, 0];

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
    arrowSizeScale: 1,
    backdrop: defaultTooltipBackdrop,
    progressBar: {
      disabled: false,
      styleProps: {},
    },
    progressOn: {
      eventType: 'click',
    },
    offset: defaultTooltipOffset,
    maxWidth: 400
  },
  actions: defaultTooltipActions,
  styleProps: {}
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
      maxWidth: 400
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
    clickOutsideToClose: true,
    progressBar: {
      disabled: false,
      styleProps: {},
    },
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

function removeUndefinedFieldsFromContent(obj) {
  for (var key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
      continue;
    }
    if (obj[key] && typeof obj[key] === "object" && !(obj[key] instanceof Element)) {
      removeUndefinedFieldsFromContent(obj[key]);
    }
  }
  return obj;
}

let defaults = {
  tooltip: defaultTooltip,
  hotspot: defaultHotspot,
  modal: defaultModal,
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

export default function combineContentWithDefaults(content: any, contentDefaults?: DeepPartial<ContentDefaults>): Content {
  content = removeUndefinedFieldsFromContent(content);

  if (contentDefaults) {
    // combine input defaults with defaults, but only for properties that exist on defaults
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
