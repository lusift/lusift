import ResizeObserver from 'resize-observer-polyfill';
declare const onElementResize: (element: any, callback: Function) => ResizeObserver;
export default onElementResize;
