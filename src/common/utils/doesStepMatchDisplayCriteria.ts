import { window, document } from 'global';
import { doesStringMatchRegex } from '../utils';

const doesStepPathMatch = (targetPath): boolean => {
  // is, endsWith, startsWith, contains, regex
  const { value, comparator } = targetPath;
  const { pathname, hash } = window.location;
  const currentPath = pathname + hash;

  switch(comparator) {
    case 'is':
      return currentPath===value;
    case 'contains':
      return currentPath.includes(value);
    case 'endsWith':
      return currentPath.endsWith(value);
    case 'startWith':
      return currentPath.startsWith(value);
    case 'regex':
      return doesStringMatchRegex(currentPath, value);
    default:
      return false;
  }
}

const isStepElementFound = (elementSelector: string): boolean => {
  /* log(this.guideData);
     log('checking if element exists') */
  return Boolean(document.querySelector(elementSelector));
}

const doesStepMatchesDisplayCriteria = ({ target, type }): boolean => {
  let criteriaMatch = doesStepPathMatch(target.path);
  if(type !=='modal') {
    criteriaMatch = criteriaMatch && isStepElementFound(target.elementSelector);
  }
  return criteriaMatch;
}

export default doesStepMatchesDisplayCriteria;
