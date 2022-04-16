import React from 'react';
import { Content } from '../../common/types';
interface LusiftReactProps {
    content: Content;
    guideID: string;
}
declare class LusiftReact extends React.Component<LusiftReactProps> {
    constructor(props: any);
    static reactRender(Component: any, targetPath: string, callback?: Function): void;
    static isReactElement(element: any): boolean;
    renderBodyContent(body: any, targetPath: string, callback?: Function): void;
    componentDidMount(): void;
    render(): any;
}
export default LusiftReact;
