import { document, window } from "global";
import { styleObjectToString, getElementPosition } from "../common/utils";
import { BEACON_CONTAINER_CLASS } from "../common/constants";

const appendTo = () => document.body;

export function div(): HTMLDivElement {
  return document.createElement('div');
}

export const positionBeacon = (
  beaconElement: HTMLDivElement,
  targetPosition,
  beaconPlacement: { top: number; left: number; }
) => {
    const { targetTop, targetLeft, targetHeight, targetWidth } = targetPosition;

    const { top, left } = beaconPlacement;

    const beaconID = beaconElement.getAttribute('id');
    const beaconContainer = beaconElement.parentElement!;
    const beaconEventReceiver = <HTMLElement>beaconElement.querySelector(`#${beaconID}-er`)!;

    Object.assign(beaconContainer.style, {
      top: `${targetTop}px`,
      left: `${targetLeft}px`,
    });

    const { width, height } = getElementPosition(<HTMLElement>beaconElement);

    Object.assign(beaconEventReceiver.style, {
        width: `${width}px`,
        height: `${height}px`,
    });

    Object.assign(beaconElement.style, {
        top: `${(top / 100) * targetHeight}px`,
        left: `${(left / 100) * targetWidth}px`
    });
}

export const createBeaconElement = ({ beaconData, beaconID, toggleTooltip }) => {

    const beaconContainer = div();
    beaconContainer.classList.add(BEACON_CONTAINER_CLASS);
    Object.assign(beaconContainer.style, {
        position: "absolute",
    });

    let { size, color, type } = beaconData;
    const animation = true;

    beaconContainer.innerHTML = `
    <style>
      #${beaconID} {
        background-color: ${color || "#b9f"};
        border-radius: 50%;
        position: absolute;
        pointer-events: auto;
        width: ${size * 13}px;
        height: ${size * 13}px;

        ${
            animation
                ? `
        -webkit-animation: shine 2s ease-in-out infinite;
        animation: shine 2s ease-in-out infinite;
          `
                : ""
        }
        cursor: pointer;
        -webkit-animation-delay: 1s;
        animation-delay: 1s;
      }


      @-webkit-keyframes shine {
        0%, 20% {
          box-shadow: 0px 0px 0px 0px rgba(187, 153, 255, 0.49);
        }
        100% {
          box-shadow: 0px 0px 0px ${20 * size}px rgba(0, 0, 0, 0);
        }
      }

      @keyframes shine {
        0%, 20% {
          box-shadow: 0px 0px 0px 0px rgba(187, 153, 255, 0.49);
        }
        100% {
          box-shadow: 0px 0px 0px ${20 * size}px rgba(0, 0, 0, 0);
        }
      }
    }
    </style>
    <div class="lusift-beacon" id="${beaconID}"></div>
  `;


    appendTo().appendChild(beaconContainer);
    const beaconElement = <HTMLElement>beaconContainer.querySelector(`#${beaconID}`)!;

    const beaconEventReceiver = div();
    beaconEventReceiver.id = `${beaconID}-er`;

    Object.assign(beaconEventReceiver.style, {
        ...beaconElement!.style,
        background: "transparent",
        zIndex: "394490",
    });

    beaconElement.appendChild(beaconEventReceiver);

    beaconEventReceiver.addEventListener("click", toggleTooltip);
    return beaconEventReceiver;
}
