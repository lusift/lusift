import * as focusTrap from "focus-trap";
import { window } from "global";

const addFocusTrap = (arg): any => {
    const {
        target,
        escapeDeactivates = (e) => false,
        clickOutsideDeactivates = (e) => false,
    } = arg;

    const isDevMode = !window.Lusift.activeGuideID;

    const ft = focusTrap.createFocusTrap(target, {
        // initialFocus: false,
        delayInitialFocus: false,
        escapeDeactivates,
        clickOutsideDeactivates,
    });
    ft.activate();
    return ft;
};

export default addFocusTrap;
