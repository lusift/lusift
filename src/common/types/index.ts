export interface StepActions {
    styleProps: object;
    closeButton: {
        styleProps: object;
        disabled: boolean;
    };
    navSection: {
        styleProps: object;
        nextButton: {
            text: string;
            styleProps: object;
            disabled: boolean;
        };
        prevButton: {
            text: string;
            styleProps: object;
            disabled: boolean;
        };
        dismissLink: {
            text: string;
            styleProps: object;
            disabled: boolean;
        };
    };
}

export interface BackdropData {
    color: string;
    opacity: string;
    stageGap: number;
    nextOnOverlayClick?: boolean;
}

export interface Step {
    index: number;
    type: string;
}


// let possiblePlacements = <let>["top", "right", "bottom", "left", "auto"];
let possiblePlacements = ["top", "right", "bottom", "left", "auto"];
possiblePlacements.forEach(placement => {
    possiblePlacements.push(placement + "-start");
    possiblePlacements.push(placement + "-end");
});

const targetPathComparator = <const>["is", "contains", "startsWith", "endsWith", "regex"];

export interface TooltipBackdrop extends Partial<BackdropData> {
    disabled: boolean;
}

export interface TooltipData {
    bodyContent: string;
    placement: typeof possiblePlacements[number];
    offset: number[];
    arrow: boolean;
    scrollIntoView: boolean;
    backdrop: Partial<TooltipBackdrop>;
    progressOn: Partial<{
        eventType: string;
        elementSelector: string;
        disabled: boolean;
    }>;
}

export interface ModalTarget {
    path: {
        value: string;
        // comparator: typeof targetPathComparator[number];
        comparator: string;
    };
}

export interface HotspotAndTooltipTarget {
    path: {
        value: string;
        // comparator: typeof targetPathComparator[number];
        comparator: string;
    };
    elementSelector: string;
}

export interface Tooltip {
    index: number;
    type: string;
    data?: Partial<TooltipData>;
    target: HotspotAndTooltipTarget;
    actions?: Partial<StepActions>;
    styleProps?: object;
}

export interface TrackingState {
    currentStepIndex: number;
    finished: boolean;
    prematurelyClosed: boolean;
    asyncSteps: {
        [key: number]: {
            toOpen: boolean;
        };
    };
    enabled: boolean;
}

export interface PopperInstanceType {
    state: object;
    destroy: () => void;
    forceUpdate: () => void;
    update: () => Promise<Object>;
    setOptions: (options: Object | ((Object) => Object)) => Promise<Object>;
}

export interface Hotspot {
    index: number;
    type: string;
    target: HotspotAndTooltipTarget;
    beacon: {
        placement: {
            top: number;
            left: number;
        };
        size?: number;
        color?: string;
        type?: string;
    };
    tip: {
        data: {
            placement: typeof possiblePlacements[number];
            arrow: boolean;
            bodyContent: string;
        };
        styleProps?: object;
    };
    async?: boolean;
}

export interface ModalData {
    bodyContent?: string;
    escToClose?: boolean;
    clickOutsideToClose?: boolean;
}

export interface Modal {
    index: number;
    type: string;
    target: ModalTarget;
    data?: Partial<ModalData>;
    closeButton?: Partial<{
        styleProps: object;
        disabled: boolean;
    }>;
}

export type StepTargetType = ModalTarget | HotspotAndTooltipTarget;

export interface GuideType {
    id: string;
    name: string;
    description?: string;
    steps: Array<Tooltip | Modal | Hotspot>;
    onNext?: () => void;
    onPrev?: () => void;
    onClose?: () => void;
}

export interface LocalState {
    [guideID: string]: {
        trackingState: TrackingState
    }
}

export interface ActiveStep {
    index: number;
    instance: any;
    target: StepTargetType;
    type: string;
    async: boolean;
}


export interface GuideInstance {
    guideData: GuideType;
    getTrackingState: () => TrackingState;
    getActiveSteps: () => ActiveStep[];
    getProgress: () => number;
    reRenderStepElements: () => void;
    removeAllActiveSteps?: () => void;
    start?: () => void;
}

export interface ElementPosition {
    top: number;
    left: number;
    right: number;
    bottom: number;
    height: number;
    width: number;
}

export interface Content {
    [guideID: string]: {
        type?: 'guide';
        data: GuideType;
    };
}

export interface ActiveGuide {
    instance: GuideInstance;
    id: string;
}

export interface LusiftInstance {
    setContent: (content: Content) => void;
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

