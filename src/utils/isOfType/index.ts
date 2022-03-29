import { GuideType, Content } from '../../types';

const hotspot1 = {
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
  async: {
    leading: true,
    following: true
  }
}

export function isObject(item: any): boolean {
  return (item instanceof Object && item.constructor === Object);
}

export function isOfTypeTooltipData(object: any): boolean {

  const placements = ['bottom', 'top', 'right', 'left', 'auto'];
  placements.forEach(p => {
    placements.push(`${p}-start`);
    placements.push(`${p}-end`);
  })

  return isObject(object) &&
    (typeof object.arrow === 'boolean') &&
    (!object.offset || (object.offset instanceof Object && object.offset.length===2)) &&
    (!object.actions || isObject(object.actions)) &&
    (placements.includes(object.placement)) &&
    (typeof object.contentBody === 'string' || (!object.contentBody && typeof object.contentBody !=='boolean')) &&
    // (typeof object.contentBody === 'string' && !!object.contentBody) &&
    (typeof object.progressOn === 'undefined' || isObject(object.progressOn)) &&
    (typeof object.backdrop === 'undefined' || isObject(object.backdrop))
}

export function isOfTypeTarget(object: any, type: string): boolean {
  // TODO make change for Modal not having an elementSelector
  const comparators = ['is', 'contains', 'endsWith', 'startsWith'];
  const elementSelectorExists = typeof object.elementSelector === 'string' && !!object.elementSelector;
  console.log(type);

  return isObject(object) &&
    (elementSelectorExists || type==='modal') && //validate element selector
    isObject(object.path) &&
    (typeof object.path.comparator === 'string' && comparators.includes(object.path.comparator)) &&
    (typeof object.path.value === 'string') //validate path
}

export function isOfTypeTooltip(object: any): boolean {
  // TODO add validators for actions and backdrop
  return (isOfTypeTooltipData(object.data)) &&
    (object.styleProps === undefined || isObject(object.styleProps)) &&
    object.type==='tooltip' &&
    (isOfTypeTooltipData(object.data))
}

const modal = {
  index: 7,
  type: 'modal',
  target: {
    path: {
      value: '/lusift/segments',
      comparator: 'contains'
    }
  },
  data: {
    bodyContent: `<h2>Hiii!</h2>`
  }
}

export function isOfTypeModal(object: any): boolean {
  return (object.type === 'modal') &&
    isObject(object.data) &&
    typeof object.data.bodyContent === 'string';
}

export function isOfTypeHotspot(object: any): boolean {
  return object.type === 'hotspot';
}

export function isOfTypeStep(object: any): boolean {

  const stepTypes = ['tooltip', 'hotspot', 'modal'];

  return isObject(object) &&
    (typeof object.index === 'number') &&
    (stepTypes.includes(object.type)) &&
    // target
    isOfTypeTarget(object.target, object.type) &&
    (isOfTypeTooltip(object) || isOfTypeHotspot(object) || isOfTypeModal(object))
}

export function isOfTypeGuide(object: any): boolean {
  return isObject(object) &&
    (typeof object.id === 'string' && !!object.id) &&
    (typeof object.name === 'string') &&
    (typeof object.description === 'string') &&
    (object.steps instanceof Object && object.steps.hasOwnProperty('length')) &&
    (object.steps.every(isOfTypeStep))
}

type ContentItem = GuideType;

export function isOfTypeContent(object: Content): boolean {
  const itemTypes = ['guide'];
  return isObject(object) &&
    Object.values(object).every((item: any) => {
      return typeof itemTypes.includes(item.type) && isOfTypeGuide(item.data);
  });
}
