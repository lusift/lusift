/* import floatingTooltip from 'floating-ui-tooltip/dev/index';
import { Instance } from 'floating-ui-tooltip/dev/types'; */
import floatingTooltip from 'floating-ui-tooltip';
import { Instance, Props } from 'floating-ui-tooltip/dist/types';
import { TOOLTIP_Z_INDEX } from '../common/constants';

const createTooltip = async (props): Promise<Instance> => {

    let {
        target,
        remove,
        arrowSizeScale,
        content,
        arrow,
        maxWidth,
        offset,
        placement,
        onShow,
        onHide,
        onBeforeFirstRender,
        onAfterFirstRender,
        showOnCreate,
        onClickOutside,
        hideOnReferenceHidden,
        hideOnTooltipEscape,
        scrollIntoView
    } = props;

    if (!remove) {
        remove = () => {};
    }

    return floatingTooltip(target, {
        allowHTML: true,
        zIndex: TOOLTIP_Z_INDEX,
        hideOnClick: false,
        onClickOutside,
        onShow,
        arrowSizeScale,
        onHide,
        onBeforeFirstRender,
        onAfterFirstRender,
        content,
        hideOnReferenceHidden,
        hideOnTooltipEscape,
        arrow,
        maxWidth,
        offset,
        placement,
        showOnCreate,
        scrollIntoView
    });
};

export default createTooltip;
