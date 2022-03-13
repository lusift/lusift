import Tooltip from './Tooltip';

interface GuideDataType {
  id: string;
  name: string;
  description: string;
  steps: {
    index: number;
    type: string;
    target: {
      path: {
        value: string;
        comporator: string;
      }
      elementSelector: string;
    };
    data: {
      placement: any;
      title: string;
      arrow: boolean;
    };
    placement: string;
  }[];
}

export default class Guide {
  private guideData: GuideDataType;
  private activeStep: number;
  private activeStepInstance: any;

  constructor(guideData: GuideDataType) {
    this.guideData = guideData;
    this.activeStep=0;
  }

  public start(): void {
    console.info('Launching guide');
    this.showStep(this.activeStep);
  }

  private showStep(stepIndex: number) {
    const { index, target, data, type } = this.guideData.steps[stepIndex];
    console.log(`Step: ${index}`);

    // TODO make nextStep and prevStep be conditional and optional
    if (type==='tooltip') {
      this.activeStepInstance = new Tooltip({
        target,
        data,
        index,
        guideID: this.guideData.id,
        nextStep: this.nextStep.bind(this),
        prevStep: this.prevStep.bind(this),
      });
    } else if (type==='modal') {

    } else {

    }
  }

  private closeCurrentStep() {
    //
  }

  public setStep(newStepNum: number) {
    // change step and see which steps need to be unmounted or mounted
    // this.closeCurrentStep();
    this.activeStep=newStepNum;
  }

  public close() {
    // close guide
  }

  private jumpToStep(stepNum: number) {
    this.setStep(stepNum);
  }

  private nextStep() {
    const newStep = this.activeStep+1;
    this.closeCurrentStep();
    this.setStep(newStep);
  }

  private prevStep() {
    const newStep = this.activeStep-1;
    this.closeCurrentStep();
    this.setStep(newStep);
  }
}

