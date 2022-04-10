import { GuideType, Content } from '../../../types';

export function isObject(item: any): boolean {
  return (item instanceof Object && item.constructor === Object);
}

export function isObjectOrUndefined(object: any): boolean {
  return isObject(object) || typeof object === 'undefined';
}

export function isOfTypeTooltipData(object: any): boolean {

  const placements = ['bottom', 'top', 'right', 'left', 'auto'];
  placements.forEach(p => {
    placements.push(`${p}-start`);
    placements.push(`${p}-end`);
  });

  return isObject(object) &&
    (typeof object.arrow === 'boolean') &&
    (!object.offset || (object.offset instanceof Object && object.offset.length===2)) &&
    (!object.actions || isObject(object.actions)) &&
    (placements.includes(object.placement)) &&
    (typeof object.contentBody === 'string' || (!object.contentBody && typeof object.contentBody !=='boolean')) &&
    // (typeof object.contentBody === 'string' && !!object.contentBody) &&
    isObjectOrUndefined(object.progressOn) &&
    isObjectOrUndefined(object.backdrop)
}

export function isOfTypeTarget(object: any, type: string): boolean {
  const comparators = ['is', 'contains', 'endsWith', 'startsWith'];
  const elementSelectorExists = typeof object.elementSelector === 'string' && !!object.elementSelector;

  return isObject(object) &&
    (elementSelectorExists || type==='modal') && //validate element selector
    isObject(object.path) &&
    (typeof object.path.comparator === 'string' && comparators.includes(object.path.comparator)) &&
    (typeof object.path.value === 'string') //validate path
}

export function isOfTypeTooltipActions(object: any): boolean {


  return (isObject(object)) &&
  Object.entries(object).every(prop => isObject(prop)) &&
  isObjectOrUndefined(object.closeButton.styleProps) &&
  isObjectOrUndefined(object.navSection.styleProps) &&
  isObjectOrUndefined(object.navSection.nextButton) &&
  isObjectOrUndefined(object.navSection.nextButton.styleProps) &&
  isObjectOrUndefined(object.navSection.prevButton) &&
  isObjectOrUndefined(object.navSection.dissmissLink) &&
  isObjectOrUndefined(object.navSection.dissmissLink.styleProps)
}

export function isOfTypeTooltip(object: any): boolean {
  return (isOfTypeTooltipData(object.data)) &&
    isObjectOrUndefined(object.styleProps) &&
    object.type==='tooltip' &&
    (isOfTypeTooltipData(object.data))
}

export function isOfTypeModal(object: any): boolean {
  return (object.type === 'modal') &&
    isObject(object.data) &&
    isObjectOrUndefined(object.closeButton);
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


export function isOfTypeHtmlElement(element): boolean {
  console.log('bodyContent')
  if(typeof element !=='object') return false;
  return (
    element.constructor.name.startsWith('HTML') &&
    element.constructor.name.endsWith('Element')
  );
}
