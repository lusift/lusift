import { BACKDROP_Z_INDEX, OVERLAY_SELECTOR_CLASS } from '../common/constants';
import { document } from 'global';
import {
  getElementPosition,
  getDocumentDimensions
} from "../common/utils/";

const div = () => document.createElement("div");

const test = ({ targetElement, stageGap, color, opacity }) => {
  const overlay = div();
  overlay.classList.add(OVERLAY_SELECTOR_CLASS);

  const { documentHeight, documentWidth } = getDocumentDimensions();

  const padding = stageGap;
  const targetPosition = getElementPosition(targetElement);

  const hTop = div();
  hTop.id = "hTop";
  const hBottom = div();
  hBottom.id = "hBottom";

  const vLeft = div();
  vLeft.id = "vLeft";
  const vLeftCover = div();
  vLeft.appendChild(vLeftCover);
  const vRight = div();
  vRight.id = "vRight";
  const vRightCover = div();
  vRight.appendChild(vRightCover);

  const overlayStyle = {
    background: color,
    transition: "visibility 0.3s ease-in-out",
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    zIndex: BACKDROP_Z_INDEX,
  };

  Object.assign(overlay.style, {
    opacity
  });

  Object.assign(hTop.style, {
    ...overlayStyle,
    height: `${targetPosition.bottom - targetPosition.height - padding}px`,
    width: `${targetPosition.right - targetPosition.left + 2 * padding}px`,
    left: `${targetPosition.left - padding}px`,
    bottom: `${targetPosition.top - padding}px`,
  });

  Object.assign(hBottom.style, {
    ...overlayStyle,
    height: `${documentHeight - (targetPosition.top + targetPosition.height + padding)}px`,
    width: `${targetPosition.right - targetPosition.left + 2 * padding}px`,
    left: `${targetPosition.left - padding}px`,
    top: `${targetPosition.bottom + padding}px`,
  });

  Object.assign(vLeft.style, {
    ...overlayStyle,
    width: `${targetPosition.left - padding}px`,
    height: `${documentHeight}px`,
    right: `${targetPosition.left - padding}px`,
  });

  Object.assign(vRight.style, {
    ...overlayStyle,
    width: `${documentWidth - (targetPosition.left + targetPosition.width) - padding - 0.2}px`,
    // HACK: ^ making width slightly smaller to prevent that window resize event firing on loop
    height: `${documentHeight}px`,
    left: `${targetPosition.right + padding}px`,
  });

  Object.assign(vLeftCover.style, {
    ...overlayStyle,
    position: 'absolute',
    right: '-2px',
    width: '3px',
    left: '',
    border: '',
    background: color,
  });
  Object.assign(vRightCover.style, {
    ...overlayStyle,
    position: 'absolute',
    border: '',
    left: '-2px',
    width: '3px',
    background: color,
  });

  [hBottom, hTop, vLeft, vRight].forEach(el => overlay.appendChild(el));

  const attachOverlay = () => document.body.appendChild(overlay);
  const detachOverlay = () => document.body.removeChild(overlay);
  const removeOverlay = () => overlay.remove();

  return {
    node: overlay,
    removeOverlay,
    detachOverlay,
    attachOverlay,
  }
}

export default test;
