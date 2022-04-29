import { window, document } from 'global';
import ResizeObserver from 'resize-observer-polyfill';

const onElementResize = (
  element: HTMLElement,
  callback: Function
) => {
  const resizeObserver = new ResizeObserver(() => callback());
  resizeObserver.observe(element);
  return resizeObserver;
};

export default onElementResize;
