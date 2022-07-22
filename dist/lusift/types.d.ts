import { DeepPartial, ActiveGuide, LocalState, Content, BodyContent, FooterContent, Tooltip, Hotspot, Modal } from '../common/types';
export declare type MinTooltip = DeepPartial<Tooltip> & {
    index: number;
} & {
    type: 'tooltip';
} & {
    target: {
        path: {
            value: string;
        };
    };
} & {
    target: {
        elementSelector: string;
    };
} & {
    data: {
        bodyContent: BodyContent;
        footerContent: FooterContent;
    };
};
export declare type MinModal = DeepPartial<Modal> & {
    index: number;
} & {
    type: 'modal';
} & {
    target: {
        path: {
            value: string;
        };
    };
} & {
    target: {
        elementSelector: string;
    };
} & {
    data: {
        bodyContent: BodyContent;
    };
};
export declare type MinHotspot = DeepPartial<Hotspot> & {
    index: number;
} & {
    type: 'hotspot';
} & {
    target: {
        path: {
            value: string;
        };
    };
} & {
    target: {
        elementSelector: string;
    };
};
export interface MinGuide {
    id: string;
    steps: Array<MinTooltip | MinModal | MinHotspot>;
}
export interface InputContent {
    [guideID: string]: {
        data: MinGuide;
    };
}
export interface DefaultTooltip {
    target: {
        path: {
            comparator: string;
            value: string;
        };
    };
    data: {
        placement: string;
        arrow: boolean;
        backdrop: {
            disabled: boolean;
            color: string;
            opacity: string;
            stageGap: number;
            nextOnOverlayClick: boolean;
        };
    };
    actions: {
        styleProps: {};
        closeButton: {
            styleProps: {};
            disabled: boolean;
        };
        navSection: {
            styleProps: {};
            nextButton: {
                text: string;
                styleProps: {};
                disabled: boolean;
            };
            prevButton: {
                text: string;
                styleProps: {};
                disabled: boolean;
            };
            dismissLink: {
                text: string;
                styleProps: {};
                disabled: boolean;
            };
        };
    };
}
export interface DefaultHotspot {
    target: {
        path: {
            comparator: string;
            value: string;
        };
    };
    beacon: {
        placement: {
            top: number;
            left: number;
        };
        size: number;
        color: string;
        type: string;
    };
    tip: {
        data: {
            placement: string;
            arrow: boolean;
        };
        styleProps: {};
    };
    async: boolean;
}
export interface DefaultModal {
    target: {
        path: {
            comparator: string;
            value: string;
        };
    };
    closeButton: {
        styleProps: {};
        disabled: boolean;
    };
    data: {};
}
export interface ContentDefaults {
    tooltip: DefaultTooltip;
    hotspot: DefaultHotspot;
    modal: DefaultModal;
}
export interface LusiftInstance {
    setContent: (content: InputContent) => void;
    showContent<T extends string>(contentID: T extends "" ? never : T): void;
    getContent: () => Content;
    refresh: () => void;
    getActiveGuide: () => ActiveGuide | null;
    enable: (guideID: string) => void;
    disable: (guideID: string) => void;
    setGlobalStyle: (style: string) => void;
    getTrackingState: () => LocalState;
    devShowStep: (guideID: string, stepNumber: number) => void;
    close: () => void;
    next: () => void;
    prev: () => void;
    goto: (newStepNum: number) => void;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    render: (body: any, targetPath: string, callback?: Function) => void;
}
