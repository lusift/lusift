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
  // vLeft.appendChild(vLeftCover);
  const vRight = div();
  vRight.id = "vRight";
  const vRightCover = div();
  // vRight.appendChild(vRightCover);

  const overlayStyle = {
    background: color,
    // background: 'rgba(0,0,0,0.4)',
    transition: "visibility 0.3s ease-in-out",
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    opacity,
    zIndex: BACKDROP_Z_INDEX,
  };
  Object.assign(overlay.style, {
    // NOTE: the opacity is creating another local stacking context which is localizing the overlay child elements to it
    // TODO: CAN WE TRY RGBA COLOR FORMAT TO AVOID OPACITY CREATING NEW STACKING CONTEXT?
    // TODO: How to put overlay at the top, and then children overlays at top of that?
    // TODO: Since the problem at root here is to do with inadequate precision in position values,
    // we can try and adjust the values and round them
    // -- but https://stackoverflow.com/questions/4308989/are-the-decimal-places-in-a-css-width-respected
    // NOTE: Ok, so the dark lines are created by cover elements overlapping on top of their overlay elements
    // -- why are we using those cover elements, and can we eliminate a need for that solution
    // opacity,
    position: 'absolute',
    zIndex: 9999, //this should be less than z-index of floating-ui-tooltip
    left: `${targetPosition.left - padding/2}px`,
    top: `${targetPosition.top - padding/2}px`,
    width: `${targetPosition.width + padding}px`,
    pointerEvents: 'none',
    height: `${targetPosition.height + padding}px`,
    boxShadow: '0 0 0 99999px rgba(0, 0, 0, .5)',
    // outline: '999999px solid rgba(0,0,0,0.5)',
  });

  // TODO: If the left, right, bottom, top are overflowing the document, make them zero

  console.log(targetPosition);
  const hBottomWidth = targetPosition.right - targetPosition.left + 2 * padding;
  const hBottomLeft = targetPosition.left - padding;
  const vLeftWidth = targetPosition.left - padding;
  const vLeftRight = targetPosition.left - padding;
  const vRightWidth = documentWidth - (targetPosition.left + targetPosition.width) - padding - 0.2;
    // HACK: ^ making width slightly smaller to prevent that window resize event firing on loop
  const vRightLeft = targetPosition.right + padding;

  console.log(`hBottomWidth: ${hBottomWidth}`);
  console.log(`hBottomLeft: ${hBottomLeft}`);
  console.log(`vLeftWidth: ${vLeftWidth}`);
  console.log(`vLeftRight: ${vLeftRight}`);
  console.log(`vRightWidth: ${vRightWidth}`);
  console.log(`vRightLeft: ${vRightLeft}`);


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
    width: `${hBottomWidth}px`,
    left: `${hBottomLeft}px`,
    top: `${targetPosition.bottom + padding}px`,
  });

  Object.assign(vLeft.style, {
    ...overlayStyle,
    width: `${vLeftWidth}px`,
    height: `${documentHeight}px`,
    right: `${vLeftRight}px`,
  });

  Object.assign(vRight.style, {
    ...overlayStyle,
    width: `${vRightWidth}px`,
    // HACK: ^ making width slightly smaller to prevent that window resize event firing on loop
    height: `${documentHeight}px`,
    left: `${vRightLeft}px`,
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
    backgroundBlendMode: 'lighten',
  });

  // [hBottom, hTop, vLeft, vRight].forEach(el => overlay.appendChild(el));

  const attachOverlay = () => document.documentElement.appendChild(overlay);
  /* const attachOverlay = () => {
    [hBottom, hTop, vLeft, vRight].forEach(el => document.documentElement.appendChild(el));
  } */
  const detachOverlay = () => document.documentElement.removeChild(overlay);
  const removeOverlay = () => overlay.remove();
  // BUG: The stacking context of overlay is not topmost, a sticky positioned element with position zIndex is layered
  // higher
  // -- see how to fix it
  // -- see if driverjs lib has this problem too?

  return {
    node: overlay,
    removeOverlay,
    detachOverlay,
    attachOverlay,
  }
}

export default test;
