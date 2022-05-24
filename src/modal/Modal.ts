import createModal, { noScrollBody, restoreScrollBody } from "./createModal";
import { document, window } from "global";
import { getStepUID, addFocusTrap } from "../common/utils";
import { ModalData } from "../common/types";
import { MODAL_OVERLAY_CLASS, MODAL_CLASS } from "../common/constants";

class Modal {
    private uid: string;
    private data: ModalData = {};
    private closeButton: any;
    private focusTrap: any;
    private index: number;
    private onRemove: Function;

    constructor({ index, guideID, data, closeButton, onRemove }) {
        this.uid = getStepUID({ guideID, type: "modal", index });
        this.data = data || {};
        this.index = index;
        this.closeButton = closeButton;
        this.addModal();

        const { escToClose, clickOutsideToClose } = this.data;

        this.focusTrap = addFocusTrap({
            target: ".modal",
            escapeDeactivates: (e): boolean => {
                console.log('escape pressed')
                if (escToClose) {
                    window['Lusift'].next();
                    return true;
                }
                return false;
            },
            clickOutsideDeactivates: (e): boolean => {
                if (
                    clickOutsideToClose &&
                    !e.target.classList.contains(MODAL_CLASS) &&
                    e.target.classList.contains(MODAL_OVERLAY_CLASS) &&
                    !e.target.closest(`.${MODAL_CLASS}`)
                ) {
                    console.log('clicked outside')
                    window['Lusift'].next();
                    return true;
                }
                return false;
            },
        });

        this.onRemove = onRemove;
    }
    // TODO: add animation for modal

    private addModal(): void {
        const { bodyContent } = this.data;

        // TODO: refactor to make createModal send a callback to remove the modal
        createModal({
            uid: this.uid,
            index: this.index,
            closeButton: this.closeButton,
        });
        noScrollBody();
    }

    private remove(): void {
        const overlayElement = document.querySelector(`.${MODAL_OVERLAY_CLASS}`);
        document.getElementById(this.uid).remove();
        this.focusTrap.deactivate();

        overlayElement.remove();
        restoreScrollBody();
        this.onRemove();
    }
}

export default Modal;
