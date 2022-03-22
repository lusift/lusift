import { GuideType, Content } from '../../types';

export function isObject(item: any): boolean {
  return (item instanceof Object && item.constructor === Object);
}

export function isOfTypeTooltipData(object: any): boolean {

  const placements = ['bottom', 'top', 'right', 'left'];

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

export function isOfTypeStep(object: any): boolean {

  const stepTypes = ['tooltip'];
  const comparators = ['is', 'contains', 'endsWith', 'startsWith'];

  return isObject(object) &&
    (typeof object.index === 'number') &&
    (stepTypes.includes(object.type)) &&
    (isOfTypeTooltipData(object.data)) &&
    // target
    isObject(object.target) &&
    (typeof object.target.elementSelector === 'string' && !!object.target.elementSelector) && //validate element selector
    isObject(object.target.path) &&
    (typeof object.target.path.comparator === 'string' && comparators.includes(object.target.path.comparator)) &&
    (typeof object.target.path.value === 'string') && //validate path
    (object.styleProps === undefined || isObject(object.styleProps)) &&
    (isOfTypeTooltipData(object.data))
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
