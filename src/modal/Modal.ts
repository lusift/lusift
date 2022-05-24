import createModal, { noScrollBody, restoreScrollBody } from "./createModal";
import { document, window } from "global";
import { getStepUID, addFocusTrap } from "../common/utils";
import { ModalData } from "../common/types";
import { MODAL_OVERLAY_CLASS } from "../common/constants";

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

        // clickOutsideToClose not working, use option clickOutsideDeactives() hook
        // -- also factor in how tooltip uses addFocusTrap
        this.focusTrap = addFocusTrap({
            target: ".modal",
            escToClose,
            clickOutsideToClose,
        });

        this.onRemove = onRemove;
        console.log(escToClose, clickOutsideToClose);

        if (escToClose) {
            window.addEventListener("keydown", this.escEventListener, true);
        }
        if (clickOutsideToClose) {
            const overlayElement = document.querySelector(`.${MODAL_OVERLAY_CLASS}`);
            // TODO: only on click on overlay, not modal
            // if the target isn't of class modal, close the modal
            overlayElement.addEventListener("click", this.overlayClickEventListener, true);
        }
    }
    // TODO: add animation for modal

    private escEventListener(e): void {
        console.log('keydown')
        console.log(e.key, e.keyCode, e.target.nodeName)
        // TODO: Fix this not working
        // -- plus it's supposed to next not close right?
        if (
            (e.key == "Escape" || e.key == "Esc" || e.keyCode == 27) &&
            e.target.nodeName == "BODY"
        ) {
            window.Lusift.close();
        }
    }
    private overlayClickEventListener(e): void {
        console.log(e.target);
        if (!e.target.classList.contains("modal")) {
            // window.Lusift.close();
        }
    }

    private addModal(): void {
        const { bodyContent } = this.data;

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

        // remove event listeners
        if (this.data.escToClose) {
            window.removeEventListener("keydown", this.escEventListener, true);
        }
        if (this.data.clickOutsideToClose) {
            overlayElement.removeEventListener("click", this.overlayClickEventListener, true);
        }
        overlayElement.remove();
        restoreScrollBody();
        this.onRemove();
    }
}

export default Modal;
