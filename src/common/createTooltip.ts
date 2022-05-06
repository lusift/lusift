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
        onClickOutside
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
        arrow,
        offset,
        placement,
        showOnCreate: true,
    });
};

export default createTooltip;
