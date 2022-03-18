import { GuideType, Content } from '../../types';

export function isOfTypeTooltipData(object: any): boolean {

  const placements = ['bottom', 'top', 'right', 'left'];

  return (object instanceof Object && object.constructor === Object) &&
    (typeof object.arrow === 'boolean') &&
    (placements.includes(object.placement)) &&
    // (typeof object.contentBody === 'string' && !!object.contentBody) &&
    (typeof object.progressOn === 'undefined' || object.progressOn instanceof Object)
}

export function isOfTypeStep(object: any): boolean {

  const stepTypes = ['tooltip'];
  const comparators = ['is', 'contains', 'endsWith', 'startsWith'];

  return (object instanceof Object && object.constructor === Object) &&
    (typeof object.index === 'number') &&
    (stepTypes.includes(object.type)) &&
    (isOfTypeTooltipData(object.data)) &&
    // target
    (object.target instanceof Object && object.target.constructor === Object) &&
    (typeof object.target.elementSelector === 'string' && !!object.target.elementSelector) && //validate element selector
    (object.target.path instanceof Object && object.target.path.constructor === Object) &&
    (typeof object.target.path.comparator === 'string' && comparators.includes(object.target.path.comparator)) &&
    (typeof object.target.path.value === 'string') && //validate path
    (isOfTypeTooltipData(object.data))
}

export function isOfTypeGuide(object: any): boolean {

  return (object instanceof Object && object.constructor === Object) &&
    (typeof object.id === 'string' && !!object.id) &&
    (typeof object.name === 'string') &&
    (typeof object.description === 'string') &&
    (object.steps instanceof Object && object.steps.hasOwnProperty('length')) &&
    (object.steps.every(isOfTypeStep))
}

type ContentItem = GuideType;

export function isOfTypeContent(object: Content): boolean {
  const itemTypes = ['guide'];
  return (object instanceof Object && object.constructor === Object) &&
    Object.values(object).every((item: any) => {
      return typeof itemTypes.includes(item.type) && isOfTypeGuide(item.data);
  });
}
