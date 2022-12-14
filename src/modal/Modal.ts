import createModal, { noScrollBody, restoreScrollBody } from "./createModal";
import { document, window } from "global";
import { getStepUID, addFocusTrap, copyObject } from "../common/utils";
import { ModalData } from "../common/types";
import { MODAL_OVERLAY_CLASS, MODAL_CLASS } from "../common/constants";

class Modal {
    private data: ModalData;
    private focusTrap: any;
    private onRemove: Function;
    private removeModal: Function;

    constructor({ index, guideID, data, closeButton, onRemove, overlay, styleProps }) {
        const uid = getStepUID({ guideID, type: "modal", index });
        this.data = copyObject(data);
        index = index;

        this.removeModal = createModal({
            uid,
            index,
            closeButton,
            styleProps,
            overlay,
            progressBar: data.progressBar
        });

        const { escToClose, clickOutsideToClose } = this.data;

        const isDevMode = !window.Lusift.getActiveGuide();

        this.focusTrap = addFocusTrap({
            target: ".modal",
            escapeDeactivates: (e): boolean => {
                if (!isDevMode && escToClose) {
                    window['Lusift'].next();
                    return true;
                }
                return false;
            },
            clickOutsideDeactivates: (e): boolean => {
                if (
                    !isDevMode &&
                    clickOutsideToClose &&
                    !e.target.classList.contains(MODAL_CLASS) &&
                    e.target.classList.contains(MODAL_OVERLAY_CLASS) &&
                    !e.target.closest(`.${MODAL_CLASS}`)
                ) {
                    window['Lusift'].next();
                    return true;
                }
                return false;
            },
        });

        this.onRemove = onRemove;
    }

    private remove(): void {
        this.focusTrap.deactivate();
        this.removeModal();
        this.onRemove();
    }
}

export default Modal;
