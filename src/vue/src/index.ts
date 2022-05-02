import { window, document } from "global";
import Lusift from "../../lusift";
import { Vue2, isVue2, isVue3, install, createApp, markRaw, isReactive } from "vue-demi";

import { Content } from "../../common/types";
import { vanillaRender } from "../../common/utils";

install();

const isVueComponent = (component: any): boolean => {
    return typeof component === "object";
};

const vueRender = (BodyComponent: any, targetPath: string, callback?: Function) => {
    console.log("vue render");
    if (isVue3) {
        const bodyApp = createApp(markRaw(BodyComponent));
        // const bodyApp = createApp(BodyComponent);
        console.log(`is reactive: ${isReactive(markRaw(BodyComponent))}`);
        bodyApp.mount(targetPath);
    } else {
        const VueComponent = (Vue2 as any).extend!(BodyComponent);
        new VueComponent().$mount(targetPath);
    }
    if (callback) callback();
};

const renderBodyContent = (body: any, targetPath: string, callback?: Function): void => {
    if (isVueComponent(body)) {
        vueRender(body, targetPath, callback);
    } else {
        console.log("vanilla render");
        vanillaRender(body, targetPath, callback);
    }
};

if (typeof window !== "undefined") {
    window.addEventListener("error", e => console.log(e), true);
    Lusift.render = renderBodyContent;
    console.log(`vue version: ${isVue2 ? "2" : isVue3 ? "3" : "unknown"}`);
    window["Lusift"] = Lusift;
}

export { Lusift as default, Content as LusiftContent };
