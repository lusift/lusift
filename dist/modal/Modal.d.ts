declare class Modal {
    private uid;
    private data;
    private closeButton;
    private focusTrap;
    constructor({ index, guideID, data, closeButton }: {
        index: any;
        guideID: any;
        data: any;
        closeButton: any;
    });
    private escEventListener;
    private overlayClickEventListener;
    private addModal;
    private remove;
}
export default Modal;
