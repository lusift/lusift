import React from 'react';
import Lusift from '../../lusift';
import { window, document } from 'global';
import ReactDOM from 'react-dom';
import { Content } from '../../common/types';
import { vanillaRender } from '../../common/utils';
import {
    isReactComponent,
    isReactClassComponent
} from '../../common/utils/isOfType';

const reactRender = (
    BodyComponent: any,
    targetPath: string,
    callback?: Function
) => {
    const target = document.querySelector(targetPath);
    ReactDOM.render(<BodyComponent />, target);
    if (callback) callback();
}

const renderBodyContent = (
    body: any,
    targetPath: string,
    callback?: Function
): void => {
    if (isReactComponent(body)) {
        reactRender(body, targetPath, callback);
    } else {
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
}

export { Lusift as default, Content as LusiftContent };
