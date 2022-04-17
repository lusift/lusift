<template>
</template>
<script lang="ts">
import Vue from "vue";
import Lusift from "../../lusift";
import { vanillaRender } from "../../common/utils";

export default {
  name: 'LusiftVue',
  props: {
    content: Object,
    guideID: String,
    showAddTask: Boolean,
  },
  methods: {
    isVueComponent(element): boolean {
      if(typeof element !=='object') return false;
      //return element instanceof Vue;
      return element._isVue;
    },

    renderer(bodyComponent, targetPath, callback): void {
      if(typeof window === 'undefined') return;
      // if type is Vue component then
      if(this.isVueComponent(bodyComponent)) {
        const target = document.querySelector(targetPath);
        bodyComponent.$mount(targetPath)
        if (callback) callback();
      } else {
        vanillaRender(bodyComponent, targetPath, callback);
      }
    }
  },
  mounted(): void {
    console.log("hi there!!1");
    console.log(this.content);
    console.log(this.guideID);
    console.log(this.showAddTask)
    if(typeof window && typeof document) {
      window['Lusift'] = Lusift;
      Lusift.render = this.renderer;
      Lusift.setContent(this.content);
      Lusift.showContent(this.guideID);
    }
  },
}
</script>
