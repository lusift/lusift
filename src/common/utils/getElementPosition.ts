import { window, document } from 'global';
import { ElementPosition } from '../types';

const getElementPosition = (element: HTMLElement): ElementPosition => {
    const { documentElement, body } = document;

    const scrollTop = window.pageYOffset || documentElement.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || documentElement.scrollLeft || body.scrollLeft;
    const elementRect = element.getBoundingClientRect();

    const position: ElementPosition = {
        top: elementRect.top + scrollTop,
        left: elementRect.left + scrollLeft,
        right: elementRect.left + scrollLeft + elementRect.width,
        bottom: elementRect.top + scrollTop + elementRect.height,
        height: elementRect.height,
        width: elementRect.width
    };
    return position;
}

export default getElementPosition;
