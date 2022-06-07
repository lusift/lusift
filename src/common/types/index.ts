import { Position, Placement } from 'floating-ui-tooltip/dist/types';
// TODO: There's only one beacon type, remove the option for animation type

export interface StepActions {
    styleProps: object;
    closeButton: {
        styleProps: object;
        disabled: boolean;
    };
    navSection: {
        disabled: boolean;
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

export type BodyContent = string | Element | object | Function;

export interface BackdropData {
    color: string;
    opacity: string;
    stageGap: number;
    nextOnOverlayClick: boolean;
}

export interface TooltipBackdrop extends Partial<BackdropData> {
    disabled: boolean;
}

export interface TooltipData {
    bodyContent: BodyContent;
    placement: Placement;
    offset: number[];
    arrow: boolean;
    scrollIntoView: boolean;
    backdrop: TooltipBackdrop;
    progressOn: {
        eventType: string;
        elementSelector: string;
        disabled: boolean;
    };
}

export type PathComparator =
    'is' |
    'contains' |
    'startsWith' |
    'endsWith' |
    'regex';

const pc: DeepPartial<PathComparator> | undefined = 'is'

export interface ModalTarget {
    path: {
        value: string;
        comparator: PathComparator;
    };
}

export interface HotspotAndTooltipTarget {
    path: {
        value: string;
        comparator: PathComparator;
    };
    elementSelector: string;
}

export interface Tooltip {
    index: number;
    type: 'tooltip';
    data: TooltipData;
    target: HotspotAndTooltipTarget;
    actions: StepActions;
    styleProps: object;
}

export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};


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
    type: 'hotspot';
    target: HotspotAndTooltipTarget;
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
            placement: Position;
            arrow: boolean;
            bodyContent: BodyContent;
        };
        styleProps: object;
    };
    async: boolean;
}

export interface ModalData {
    bodyContent: BodyContent;
    escToClose: boolean;
    clickOutsideToClose: boolean;
}

export interface Modal {
    index: number;
    type: 'modal';
    target: ModalTarget;
    data: ModalData;
    closeButton: {
        styleProps: object;
        disabled: boolean;
    };
}

export type StepTargetType = ModalTarget | HotspotAndTooltipTarget;

export interface GuideType {
    id: string;
    name: string;
    description: string;
    steps: Array<Tooltip | Modal | Hotspot>;
    onNext: () => void;
    onPrev: () => void;
    onClose: () => void;
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
        type: 'guide';
        data: GuideType;
    };
}

export interface ActiveGuide {
    instance: GuideInstance;
    id: string;
}
