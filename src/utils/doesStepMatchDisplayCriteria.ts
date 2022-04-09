import { window, document } from 'global';
import { doesStringMatchRegex } from '../utils';

const doesStepPathMatch = (targetPath): boolean => {
  // is, endsWith, startsWith, contains, regex
  const { value, comparator } = targetPath;
  const { pathname } = window.location;
  switch(comparator) {
    case 'is':
      return pathname===value;
    case 'contains':
      return pathname.includes(value);
    case 'endsWith':
      return pathname.endsWith(value);
    case 'startWith':
      return pathname.startsWith(value);
    case 'regex':
      return doesStringMatchRegex(pathname, value);
  }
}

const isStepElementFound = (elementSelector: string): boolean => {
  /* console.log(this.guideData);
     console.log('checking if element exists') */
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
