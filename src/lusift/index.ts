import Lusift from "./Lusift";
import { LusiftInstance } from './types';

const lusiftInstance = new Lusift();

const {
    setContent,
    showContent,
    getContent,
    refresh,
    getActiveGuide,
    enable,
    disable,
    setGlobalStyle,
    getTrackingState,
    devShowStep,
    close,
    next,
    prev,
    goto,
    onClose,
    onNext,
    onPrev,
    render
} = lusiftInstance;


const instance: LusiftInstance = {
    setContent: setContent.bind(lusiftInstance),
    showContent: showContent.bind(lusiftInstance),
    getContent: getContent.bind(lusiftInstance),
    refresh: refresh.bind(lusiftInstance),
    getActiveGuide: getActiveGuide.bind(lusiftInstance),
    enable: enable.bind(lusiftInstance),
    disable: disable.bind(lusiftInstance),
    setGlobalStyle: setGlobalStyle.bind(lusiftInstance),
    getTrackingState: getTrackingState.bind(lusiftInstance),
    devShowStep: devShowStep.bind(lusiftInstance),
    close: close.bind(lusiftInstance),
    next: next.bind(lusiftInstance),
    prev: prev.bind(lusiftInstance),
    goto: goto.bind(lusiftInstance),
    onClose: onClose.bind(lusiftInstance),
    onNext: onNext.bind(lusiftInstance),
    onPrev: onPrev.bind(lusiftInstance),
    render: render
}

export default instance;
