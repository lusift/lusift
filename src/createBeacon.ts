import { document } from 'global';
import { styleObjectToString } from './utils';

const createBeacon = ({ targetPosition, beaconData, beaconID }) => {
  const { targetTop, targetLeft, targetHeight, targetWidth } = targetPosition;

  const beaconContainer = document.createElement('div');
  beaconContainer.style.cssText = styleObjectToString({
    position: 'absolute',
    top: `${targetTop}px`,
    left: `${targetLeft}px`
  });
  beaconContainer.classList.add('lusift-beacon-container');

  const { placement, size, color, type } = beaconData;
  const { top, left } = placement;
  const animation = true;

  beaconContainer.innerHTML = `
  <style>
  #${beaconID} {
    background-color: ${color || '#b9f'};
    border-radius: 50%;
    position: absolute;
    z-index: 20;
    width: ${size *13}px;
    height: ${size *13}px;
    -webkit-animation: shine 2s ease-in-out infinite;
    animation: shine 2s ease-in-out infinite;
    cursor: pointer;
    -webkit-animation-delay: 1s;
    animation-delay: 1s;
    top: ${(top/100)*targetHeight}px;
    left: ${(left/100)*targetWidth}px;
  }

  ${animation? `

    @-webkit-keyframes shine {
      0%, 20% {
        box-shadow: 0px 0px 0px 0px rgba(187, 153, 255, 0.49);
      }
      100% {
        box-shadow: 0px 0px 0px ${25*size}px rgba(0, 0, 0, 0);
      }
    }

    @keyframes shine {
      0%, 20% {
        box-shadow: 0px 0px 0px 0px rgba(187, 153, 255, 0.49);
      }
      100% {
        box-shadow: 0px 0px 0px ${25*size}px rgba(0, 0, 0, 0);
      }
    }`: ''
  }
  </style>
  <div id="${beaconID}"></div>
  `;

  if(type!=='pulsing') {
    // TODO fa-question-circle
    beaconContainer.innerHTML = `
    <style>
    #${beaconID} {
      background-color: ${color || '#b9f'};
      border-radius: 50%;
      position: absolute;
      z-index: 20;
      width: ${size *13}px;
      height: ${size *13}px;
      cursor: pointer;
      top: ${(top/100)*targetHeight}px;
      left: ${(left/100)*targetWidth}px;
    }
    </style>

    <div id="${beaconID}"></div>
    `;
  }
  document.body.appendChild(beaconContainer);
}

export default createBeacon;
