import createModal from './createModal';
import { document } from 'global';
import { getStepUID } from './utils';
import { Modal as ModalData } from './types';
import { MODAL_OVERLAY_CLASS } from './constants';

class Modal {
  private uid: string;
  private data: any;
  private closeButton: any;

  constructor({ index, guideID, data, closeButton }) {
    this.uid = getStepUID({guideID, type:'modal', index});
    this.data = data;
    this.closeButton = closeButton;
    this.addModal();
  }

  private addModal(): void {
    const { bodyContent } = this.data;

    createModal({
      uid: this.uid,
      bodyContent,
      closeButton: this.closeButton
    });
  }

  private remove(): void {
    document.getElementsByClassName(MODAL_OVERLAY_CLASS)[0].remove();
    document.getElementById(this.uid).remove();
  }
}

export default Modal;
