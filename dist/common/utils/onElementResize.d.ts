import ResizeObserver from 'resize-observer-polyfill';
declare const onElementResize: (element: HTMLElement, callback: Function) => ResizeObserver;
export default onElementResize;
