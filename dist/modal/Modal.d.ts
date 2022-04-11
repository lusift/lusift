declare class Modal {
    private uid;
    private data;
    private closeButton;
    constructor({ index, guideID, data, closeButton }: {
        index: any;
        guideID: any;
        data: any;
        closeButton: any;
    });
    private addModal;
    private remove;
}
export default Modal;
