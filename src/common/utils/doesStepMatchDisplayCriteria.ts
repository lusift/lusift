import { window, document } from "global";
import doesStringMatchRegex from "./doesStringMatchRegex";

// e.g: currentPath = /lusift/boards | value = /*/boards
let doesPathMatch = (currentPath: string, value: string) => {
    // remove `/`s from both ends of the string
    if (currentPath[0] === '/') currentPath = currentPath.slice(1,);
    if (currentPath[currentPath.length-1] === '/') currentPath = currentPath.slice(0, currentPath.length-1);

    const currentPathElements = currentPath.split('/');

    if (value[0] === '/') value = value.slice(1,);
    if (value[value.length-1] === '/') value = value.slice(0, value.length-1);

    const valuePathElements = value.split('/');
    if (valuePathElements.length !== currentPathElements.length) return false;
    return valuePathElements.every((value, index) => {
        return value === currentPathElements[index] || value === '*';
    });
}

const doesStepPathMatch = (targetPath): boolean => {
    // is, endsWith, startsWith, contains, regex
    const { value, comparator } = targetPath;
    const { pathname, hash } = window.location;
    const currentPath = pathname + hash;

    switch (comparator) {
        case "is":
            return currentPath === value;
        case "contains":
            return currentPath.includes(value);
        case "endsWith":
            return currentPath.endsWith(value);
        case "startWith":
            return currentPath.startsWith(value);
        case "regex":
            return doesPathMatch(currentPath, value);
        default:
            return false;
    }
};

const isStepElementFound = (elementSelector: string): boolean => {
    /* log(this.guideData);
     log('checking if element exists') */
    return Boolean(document.querySelector(elementSelector));
};

const doesStepMatchesDisplayCriteria = ({ target, type }): boolean => {
    let criteriaMatch = doesStepPathMatch(target.path);
    if (type !== "modal") {
        criteriaMatch = criteriaMatch && isStepElementFound(target.elementSelector);
    }
    return criteriaMatch;
};

export default doesStepMatchesDisplayCriteria;
