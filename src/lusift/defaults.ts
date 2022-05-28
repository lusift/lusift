import { Content } from '../common/types';
import { mergeDeep } from '../common/utils';

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

const defaultTooltip = {
  target: {
    path: {
      comparator: 'is'
    },
  },
  data: {
    placement: 'bottom',
    arrow: true,
    backdrop: defaultTooltipBackdrop,
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
  }
}

const defaultGuideData = {
  name: '',
  description: '',
  steps: [],
  onNext: () => {},
  onPrev: () => {},
  onClose: () => {}
}

// TODO: Declare different types of content, one that's associated with incoming data, and other for the end result

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

export default function combineContentWithDefaults(content): Content {
  content = removeUndefinedFields(content);

  Object.keys(content).forEach((guideID) => {
    const guideData = content[guideID].data;

    let completedGuideData = mergeDeep(defaultGuideData, guideData);
    let steps = completedGuideData.steps;
    steps = steps.map((step, index) => {
      let completedStep = step;
      if (step.type === 'tooltip') {
        completedStep = mergeDeep(defaultTooltip, step);
      } else if (step.type === 'hotspot') {
        completedStep = mergeDeep(defaultHotspot, step);
      } else if (step.type === 'modal') {
        completedStep = mergeDeep(defaultModal, step);
      }
      return completedStep;
    });
    completedGuideData.steps = steps;
    content[guideID].data = completedGuideData;
  });
  return content;
}
