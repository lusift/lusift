import { GuideType } from '../common/types';
export default class Guide {
    readonly guideData: GuideType;
    private trackingState;
    private activeStepInstance;
    private activeStepInstances;
    constructor(guideID: string);
    private generateTrackingState;
    start(): void;
    private attemptToShowActiveStep;
    private isStepAlreadyActive;
    private attemptToStartAsyncSteps;
    private removeIllegalSteps;
    private updateLocalTrackingState;
    private clearTrackingState;
    setStep(newStepNum: number): void;
    private close;
    private closeCurrentStep;
    private nextStep;
    private prevStep;
}
