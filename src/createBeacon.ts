import { document, window } from 'global';
import { styleObjectToString, getElementPosition } from './utils';
import { BEACON_CONTAINER_CLASS } from './constants';

const createBeacon = ({ targetPosition, beaconData, beaconID, toggleTooltip }) => {
  const { targetTop, targetLeft, targetHeight, targetWidth } = targetPosition;

  const beaconContainer = document.createElement('div');
  beaconContainer.style.cssText = styleObjectToString({
    position: 'absolute',
    top: `${targetTop}px`,
    left: `${targetLeft}px`
  });
  beaconContainer.classList.add(BEACON_CONTAINER_CLASS);

  let { placement, size, color, type } = beaconData;
  const { top, left } = placement;
  const animation = true;

  beaconContainer.innerHTML = `
  <style>
  #${beaconID} {
    background-color: ${color || '#b9f'};
    border-radius: 50%;
    position: absolute;
    pointer-events: auto;
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
        box-shadow: 0px 0px 0px ${20*size}px rgba(0, 0, 0, 0);
      }
    }

    @keyframes shine {
      0%, 20% {
        box-shadow: 0px 0px 0px 0px rgba(187, 153, 255, 0.49);
      }
      100% {
        box-shadow: 0px 0px 0px ${20*size}px rgba(0, 0, 0, 0);
      }
    }`: ''
  }
  </style>
  <div id="${beaconID}"></div>
  `;

  document.body.appendChild(beaconContainer);
  const beaconElement = document.getElementById(beaconID);

  const beaconEventReceiver = document.createElement('div');
  beaconEventReceiver.id=`${beaconID}-er`;
  const { width, height } = getElementPosition(beaconElement);
  console.log(width, height)

  beaconEventReceiver.style.cssText = styleObjectToString({
    ...beaconElement.style,
    width: `${width}px`,
    height: `${height}px`,
    background: 'transparent',
    // position: 'absolute',
    // backgroundColor: 'red',
    zIndex: '394490',
    // pointerEvents: 'none'
  });
  beaconElement.appendChild(beaconEventReceiver);
  console.log(beaconEventReceiver);
  console.log(beaconElement);

  // beaconElement.addEventListener('click', () => window.alert('byyyeee'))
  beaconEventReceiver.addEventListener('click', toggleTooltip);
}

export default createBeacon;
