import { createApp } from "vue";
import LusiftVue from "./LusiftVue.vue";

createApp(LusiftVue).mount("#app");

const LusiftLibrary = {
  install(Vue: any): void {
    Vue.component("lusift-library", LusiftVue);
  }
};

// export default LusiftLibrary;
export default LusiftVue;

if (typeof window !== "undefined" && window["Vue"]) {
  window["Vue"].use(LusiftLibrary);
}
