import createModal from './createModal';
import { document, window } from 'global';
import { getStepUID } from '../common/utils';
import { Modal as ModalData } from '../common/types';
import { MODAL_OVERLAY_CLASS } from '../common/constants';


class Modal {
  private uid: string;
  private data: any;
  private closeButton: any;

  constructor({ index, guideID, data, closeButton }) {
    this.uid = getStepUID({guideID, type:'modal', index});
    this.data = data;
    this.closeButton = closeButton;
    this.addModal();
    if(this.data.escToClose) {
      window.addEventListener('keydown', this.escEventListener, true);
    }
    if(this.data.clickOutsideToClose) {
      const overlayElement = document.querySelector(`.${MODAL_OVERLAY_CLASS}`)
      overlayElement.addEventListener('click', this.overlayClickEventListener, true);
    }
  }

  private escEventListener(e): void {
    if((e.key=='Escape'||e.key=='Esc'||e.keyCode==27) && (e.target.nodeName=='BODY')){
      window.Lusift.close();
    }
  }
  private overlayClickEventListener(e): void {
    if (!e.target.classList.contains('modal')) {
      window.Lusift.close();
    }
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

    // remove event listeners
    if(this.data.escToClose) {
      window.removeEventListener('keydown', this.escEventListener, true);
    }
    if(this.data.clickOutsideToClose) {
      const overlayElement = document.querySelector(`.${MODAL_OVERLAY_CLASS}`)
      overlayElement.removeEventListener('click', this.overlayClickEventListener, true);
    }
  }
}

export default Modal;
