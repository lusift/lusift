import { GuideType, TrackingState } from '../common/types';
export default class Guide {
    readonly guideData: GuideType;
    private activeSteps;
    constructor(guideID: string);
    private generateNewTrackingState;
    start(): void;
    private removeAllActiveSteps;
    reRenderStepElements(): void;
    private attemptToShowActiveStep;
    private isStepAlreadyActive;
    private attemptToStartAsyncSteps;
    private removeIllegalSteps;
    private setTrackingState;
    getTrackingState(): TrackingState;
    private clearTrackingState;
    setStep(newStepNum: number): void;
    private close;
    private closeCurrentStep;
    private nextStep;
    private prevStep;
}
