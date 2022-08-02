import { window } from "global";
import { loadState } from "../store";
import {
    DEFAULT_TOOLTIP_BORDER_RADIUS,
    DEFAULT_MODAL_BORDER_RADIUS,
    PRIMARY_COLOR,
    DEFAULT_PROGRESS_BAR_HEIGHT,
    PROGRESS_BAR_CLASS
} from "../constants";

// TODO: Add progress bar to content object

const renderProgressBar = () => {
    const currentGuide = loadState()[window.Lusift.getActiveGuide()?.id];

    if (!currentGuide) return "";
    if (!currentGuide) {
        // Assuming that this is dev mode
        let progress = "66.66";
        let max = 100;
        return `
        <progress class="lusift-progress" aria-label="progressbar" max="${max}" value="${progress}">
        ${progress}%
        </progress>
        `;
    }

    const Lusift = window['Lusift'];
    const guideData = Lusift.getContent()[Lusift.getActiveGuide().id].data;
    const currentStep = guideData.steps[currentGuide.trackingState.currentStepIndex];
    const progressBarData = currentGuide.progressBar || {};

    // find out borderRadius based on step type (their default border radii), or via styleProps
    // TODO: add styleProps object to content, and see how to consume it
    // -- do the same for beacon btw
    let {
        height = DEFAULT_PROGRESS_BAR_HEIGHT,
        backgroundColor = PRIMARY_COLOR,
        borderRadius,
    } = progressBarData;

    // TODO: Better way to retrieve borderRadius from tooltip dom element?
    if (!borderRadius) {
        if (currentStep.type === "modal") {
            if (currentStep.styleProps) {
                borderRadius = currentStep.styleProps.borderRadius || DEFAULT_MODAL_BORDER_RADIUS;
            } else {
                borderRadius = DEFAULT_MODAL_BORDER_RADIUS;
            }
        } else {
            if (currentStep.styleProps) {
                borderRadius = currentStep.styleProps.borderRadius || DEFAULT_TOOLTIP_BORDER_RADIUS;
            } else {
                borderRadius = DEFAULT_TOOLTIP_BORDER_RADIUS;
            }
        }
    }

    const progress = Lusift.getActiveGuide().instance.getProgress();

    const max = 100;

    const progressBarElement = document.createElement("progress");
    progressBarElement.classList.add(PROGRESS_BAR_CLASS);
    progressBarElement.setAttribute("aria-label", "progressbar");
    progressBarElement.setAttribute("max", `${max}`);
    progressBarElement.setAttribute("value", progress);
    // move style rules to parent (tooltip or modal)
    return progressBarElement;
};

export default renderProgressBar;
