import { window } from 'global';
import { loadState } from '../store';
import {
  DEFAULT_TOOLTIP_BORDER_RADIUS,
  DEFAULT_MODAL_BORDER_RADIUS,
  PRIMARY_COLOR,
  DEFAULT_PROGRESS_BAR_HEIGHT
} from '../constants';

const renderProgressBar = () => {

  const currentGuide = loadState()[window.Lusift.activeGuideID];

  if(!currentGuide) return '';
  if (!currentGuide) {
    // Assuming that this is dev mode
    let progress = '66.66';
    let max = 100;
    return `
      <progress class="lusift-progress" aria-label="progressbar" max="${max}" value="${progress}">
        ${progress}%
      </progress>
    `;
  }


  const currentStep = currentGuide.steps[currentGuide.trackingState.activeStep];
  const progressBarData = currentGuide.progressBar || {};

  // find out borderRadius based on step type (their default border radii), or via styleProps
  let { height=DEFAULT_PROGRESS_BAR_HEIGHT, color=PRIMARY_COLOR, borderRadius } = progressBarData;

  if (!borderRadius){
    if (currentStep.type === 'modal'){
      if (currentStep.styleProps){
        borderRadius = currentStep.styleProps.borderRadius || DEFAULT_MODAL_BORDER_RADIUS;
      } else {
        borderRadius = DEFAULT_MODAL_BORDER_RADIUS;
      }
    } else {
      if(currentStep.styleProps){
        borderRadius = currentStep.styleProps.borderRadius || DEFAULT_TOOLTIP_BORDER_RADIUS;
      } else {
        borderRadius = DEFAULT_TOOLTIP_BORDER_RADIUS;
      }
    }
  }
  // filter out steps that are not of type hotspot with async property of true
  const syncSteps = currentGuide.steps.filter(step => !(step.type === 'hotspot' && step.async));
  const progress = ((syncSteps.findIndex(step => step.index === currentStep.index)+1) / (syncSteps.length+1))*100;

  const max = 100;

  // TODO put this with right defaults in global default css file
  return `
    <style>
      .lusift-progress {
        height: ${height};
      }
      .lusift-progress::-webkit-progress-bar {
        border-radius: ${borderRadius}; /*border-radius of tooltip*/
      }
      .lusift-progress::-webkit-progress-value {
        background-color: ${color}; /*color of progress bar*/
      }
    </style>

    <progress class="lusift-progress" aria-label="progressbar" max="${max}" value="${progress}">
      ${progress}%
    </progress>
    `;
}

export default renderProgressBar;
