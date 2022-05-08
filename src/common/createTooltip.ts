/* import floatingTooltip from 'floating-ui-tooltip/dev/index';
import { Instance } from 'floating-ui-tooltip/dev/types'; */
import floatingTooltip from 'floating-ui-tooltip';
import { Instance, Props } from 'floating-ui-tooltip/dist/types';

const createTooltip = async (props): Promise<Instance> => {

    let {
        target,
        remove,
        content,
        arrow,
        offset,
        placement,
        onShow,
        onHide,
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
        zIndex: 99999,
        hideOnClick: false,
        onClickOutside,
        onShow,
        onHide,
        content,
        hideOnReferenceHidden,
        hideOnTooltipEscape,
        arrow,
        offset,
        placement,
        showOnCreate,
        scrollIntoView
    });
};

export default createTooltip;
