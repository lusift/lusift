declare const renderTooltip: ({ data, target, styleProps, actions, uid, index, onShow, onHide, scrollIntoView }: {
    data: any;
    target: any;
    styleProps: any;
    actions: any;
    uid: any;
    index: any;
    onShow: any;
    onHide: any;
    scrollIntoView: any;
}) => Promise<import("floating-ui-tooltip/dist/types").Instance>;
export default renderTooltip;
