import { window, document } from 'global';
import Lusift from '../../lusift';
import Vue, { createApp } from 'vue';
import { Content } from '../../common/types';
import { vanillaRender } from '../../common/utils';

const isVueComponent = (component: any): boolean => {
  return typeof component === 'object';
}

const vueRender = (BodyComponent: any, targetPath: string, callback?: Function) => {
  console.log('vue render');
  const bodyApp = createApp(BodyComponent);
  bodyApp.mount(targetPath);
  if (callback) callback();
}

const renderBodyContent = (body: any, targetPath: string, callback?: Function): void => {
  if (isVueComponent(body)) {
    vueRender(body, targetPath, callback);
  } else {
    console.log('vanilla render');
    vanillaRender(body, targetPath, callback);
  }
}

if (typeof window !== "undefined") {
  window.addEventListener(
    'error',
    (e) => console.log(e),
    true
  );
  Lusift.render = renderBodyContent;
  window['Lusift'] = Lusift;
  window['Vue'] = Vue;
}

export { Lusift as default, Content as LusiftContent };
