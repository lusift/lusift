import React from 'react';
import Lusift from '../../lusift';
import { window } from 'global';
import ReactDOM from 'react-dom';
import { Content } from '../../common/types';
import { vanillaRender } from '../../common/utils';

// TODO 1. connect hooks, including refresh()
// TODO 2. perf: bundle size of dist/lusift-react.js is too big
// TODO 3. refactor

// In case of customizing hotspot's beacon, we can just have a beaconElement property
// that is processed by Hotspot class, at guide level and step level

interface LusiftReactProps {
    content: Content;
    guideID: string;
}

class LusiftReact extends React.Component<LusiftReactProps> {

    constructor(props) {
        super(props);
    }

    // types not applied yet
    static reactRender(Component: any, targetPath: string, callback?: Function) {
        const target = document.querySelector(targetPath);
        ReactDOM.render(<Component />, target);
        if (callback) callback();
    }

    static isReactElement(element: any): boolean {
        if(typeof element !== 'function') return false;

        return element().$$typeof === Symbol.for('react.element');
        // React.isValidElement is a little unreliable
        return React.isValidElement(element);
    }

    renderBodyContent(body, targetPath: string, callback?: Function) {
        if (LusiftReact.isReactElement(body)) {
            LusiftReact.reactRender(body, targetPath, callback);
        } else {
            vanillaRender(body, targetPath, callback);
        }
    }

    componentDidMount() {
        window['Lusift'] = Lusift;
        Lusift.render = this.renderBodyContent;
        Lusift.setContent(this.props.content);
        Lusift.showContent(this.props.guideID);
    }

    render() {
        return null;
    }
}

export default LusiftReact;
