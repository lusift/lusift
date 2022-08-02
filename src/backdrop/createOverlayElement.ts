import { BACKDROP_Z_INDEX, OVERLAY_SELECTOR_CLASS } from '../common/constants';
import { document } from 'global';
import {
  getElementPosition,
  getDocumentDimensions
} from "../common/utils/";

const div = () => document.createElement("div");

const hexToRgbA = (hex: string, opacity: number) => {
    let c: any;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+`,${opacity})`;
    }
    return `rgba(0, 0, 0, ${opacity})`;
}

const createOverlay = ({ targetElement, stageGap, color, opacity }) => {
  const overlay = div();
  overlay.classList.add(OVERLAY_SELECTOR_CLASS);

  const padding = stageGap;
  const targetPosition = getElementPosition(targetElement);

  Object.assign(overlay.style, {
    position: 'absolute',
    zIndex: BACKDROP_Z_INDEX,
    left: `${targetPosition.left - padding/2}px`,
    top: `${targetPosition.top - padding/2}px`,
    width: `${targetPosition.width + padding}px`,
    pointerEvents: 'none',
    height: `${targetPosition.height + padding}px`,
    boxShadow: `0 0 0 99999px ${hexToRgbA(color, opacity)}`,
  });

  const attachOverlay = () => document.documentElement.appendChild(overlay);
  const detachOverlay = () => document.documentElement.removeChild(overlay);
  const removeOverlay = () => overlay.remove();

  return {
    node: overlay,
    removeOverlay,
    detachOverlay,
    attachOverlay,
  }
}

export default createOverlay;
