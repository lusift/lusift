import createModal from './createModal';
import { document } from 'global';
import { getStepUID } from './utils';
import { Modal as ModalData } from './types';

class Modal {
  private uid: string;
  private data: any;

  constructor({ index, guideID, data }) {
    this.uid = getStepUID({guideID, type:'modal', index});
    this.data = data;
    this.addModal();
    console.log(data)
  }

  private addModal(): void {
    const { bodyContent } = this.data;

    createModal({
      uid: this.uid,
      bodyContent
    });
  }

  private remove(): void {
    document.querySelector('.lusift-modal-overlay').remove();
    document.getElementById(this.uid).remove();
  }
}

export default Modal;
