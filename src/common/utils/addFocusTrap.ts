import * as focusTrap from 'focus-trap';
import { window } from 'global';

const addFocusTrap = ({
  target,
  escToClose,
  clickOutsideToClose
}): any => {

  // TODO: fix this, what is window.activeGuideID?
  const isDevMode = !window.activeGuideID;

  const ft = focusTrap.createFocusTrap(target, {
    initialFocus: false,
    escapeDeactivates: !isDevMode && escToClose,
    clickOutsideDeactivates: !isDevMode && clickOutsideToClose,
  });
  ft.activate();
  return ft;
}

export default addFocusTrap;
