import createModal from './createModal';
import { Modal as ModalData } from './types';

const modal = {
  index: 7,
  type: 'modal',
  target: {
    path: {
      value: '/lusift/segments',
      comparator: 'contains'
    }
  },
  data: {
    bodyContent: `<h2>Hiii!</h2>`
  }
}


class Modal {
  constructor({ index, guideID, data }) {
    // TODO generate uid
    this.addModal();
  }
  private addModal(): void {
    createModal();
  }
}

export default Modal;
