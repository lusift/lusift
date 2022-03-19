import { isObject } from './isOfType';
/*
* Deep merge properties of two objects
* replace with lodash.merge if insufficient
*/
export function mergeObjects(obj1: Object, obj2: Object) {
  obj1 = Object.assign({}, obj1);
  obj2 = Object.assign({}, obj2);

  Object.keys(obj2).forEach((key) => {
    try {
      // Property in destination object set; update its value.
      if (isObject(obj2[key])) {
        obj1[key] = mergeObjects(obj1[key], obj2[key]);
      } else {
        obj1[key] = obj2[key];
      }
    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[key] = obj2[key];
    }
  });
  return obj1;
}
