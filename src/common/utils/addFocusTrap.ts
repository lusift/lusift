import * as focusTrap from "focus-trap";
import { window } from "global";


const addFocusTrap = ({ target, escToClose, clickOutsideToClose }): any => {
    const isDevMode = !window.Lusift.activeGuideID;

    const ft = focusTrap.createFocusTrap(target, {
        // initialFocus: false,
        delayInitialFocus: false,
        escapeDeactivates: !isDevMode && escToClose,
        clickOutsideDeactivates: !isDevMode && clickOutsideToClose,
    });
    ft.activate();
    return ft;
};

export default addFocusTrap;
