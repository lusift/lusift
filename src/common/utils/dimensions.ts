import getElementPosition from './getElementPosition';
import { document, window } from 'global';

export default function getDocumentDimensions(): { documentWidth: number; documentHeight: number } {
    const { height: clientHeight, width: clientWidth } = getElementPosition(
        document.documentElement,
    );

    const documentWidth = Math.max(
        clientWidth,
        document.body["scrollWidth"],
        document.documentElement["scrollWidth"],
        document.body["offsetWidth"],
        document.documentElement["offsetWidth"],
    );
    const documentHeight = Math.max(
        clientHeight,
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
    );

    return {
        documentWidth,
        documentHeight,
    };
}
