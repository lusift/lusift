import { window, document } from 'global';
import Lusift from '../../../../lusift';

import { Content } from '../../../../common/types';
import { vanillaRender } from '../../../../common/utils';

const isAngularComponent = (component: any): boolean => {
  return true;
}

const angularRender = (body: any, targetPath: String, callback?: Function): void => {
  console.log('render angular component')
}

const renderBodyContent = (body: any, targetPath: string, callback?: Function): void => {
  if (isAngularComponent(body)) {
    angularRender(body, targetPath, callback);
  } else {
    console.log('vanilla render');
    vanillaRender(body, targetPath, callback);
  }
}

if (typeof window !== "undefined") {
  window.addEventListener(
    'error',
    (e: any) => console.log(e),
    true
  );
  Lusift.render = renderBodyContent;
  window['Lusift'] = Lusift;
}

export { Lusift as default, Content as LusiftContent };
