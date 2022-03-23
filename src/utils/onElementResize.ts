import { window, document } from 'global';

const onElementResize = (element: document.HTMLElement, callback: Function) => {
  if (typeof window !== "undefined") {
    const { ResizeObserver } = window;
    const resizeObserver = new ResizeObserver(() => callback());
    resizeObserver.observe(element);
  }
};

export default onElementResize;
