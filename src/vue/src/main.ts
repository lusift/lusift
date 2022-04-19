import { window, document } from 'global';
import Lusift from '../../lusift';
import Vue from 'vue';
import { Content } from '../../common/types';
import { vanillaRender } from '../../common/utils';

import { createApp } from "vue";
import LusiftVue from "./LusiftVue.vue";

/* createApp(LusiftVue).mount("#app");

const LusiftLibrary = {
  install(Vue: any): void {
    Vue.component("lusift-library", LusiftVue);
  }
};

// export default LusiftLibrary;
export default LusiftVue;

if (typeof window !== "undefined" && window["Vue"]) {
  window["Vue"].use(LusiftLibrary);
} */

const isVueComponent = (component: any): boolean => {
  return typeof component === 'object';
  return (
    typeof component === "function" &&
    component.prototype &&
    component.prototype.render
  );
}
// TODO: Seperate default content body data into seperate files and access bodyContent from render methods

const vueRender = (BodyComponent: any, targetPath: string, callback?: Function) => {
  console.log('vue render');
  // TODO: Inject vue component BodyComponent into html path with html selector targetPath
  const app = createApp(BodyComponent);
  app.mount(targetPath);
  console.log(app);
  console.log('mount!!!!!!!!')
  if (callback) callback();
}

const renderBodyContent = (body: any, targetPath: string, callback?: Function): void => {
  console.log('component received by lusift-vue');
  console.log(window['Lusift'].content['guide1'].data.steps[0].data)
  console.log(body);
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
