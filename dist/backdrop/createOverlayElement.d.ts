declare const createOverlay: ({ targetElement, stageGap, color, opacity }: {
    targetElement: any;
    stageGap: any;
    color: any;
    opacity: any;
}) => {
    node: any;
    removeOverlay: () => any;
    detachOverlay: () => any;
    attachOverlay: () => any;
};
export default createOverlay;
