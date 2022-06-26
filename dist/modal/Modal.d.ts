declare class Modal {
    private data;
    private focusTrap;
    private onRemove;
    private removeModal;
    constructor({ index, guideID, data, closeButton, onRemove, overlay, styleProps }: {
        index: any;
        guideID: any;
        data: any;
        closeButton: any;
        onRemove: any;
        overlay: any;
        styleProps: any;
    });
    private remove;
}
export default Modal;
