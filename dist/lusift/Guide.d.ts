import { GuideType, ActiveStep, TrackingState } from "../common/types";
export default class Guide {
    readonly guideData: GuideType;
    private activeSteps;
    constructor(guideID: string);
    getActiveSteps(): ActiveStep[];
    private generateNewTrackingState;
    start(): void;
    removeAllActiveSteps(): void;
    reRenderStepElements(): void;
    private attemptToShowActiveStep;
    private isStepActive;
    getProgress(): number;
    private attemptToStartAsyncSteps;
    private removeIllegalSteps;
    private setTrackingState;
    getTrackingState(): TrackingState;
    resetTrackingState(): void;
    setStep(newStepNum: number): void;
    remove(): void;
    private closeCurrentStep;
    nextStep(): void;
    prevStep(): void;
}
