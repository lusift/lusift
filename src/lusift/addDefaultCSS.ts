import { window, document } from "global";
import lusiftDefaultCSS from "./style/lusift.css";
import {
    PRIMARY_COLOR,
    DEFAULT_MODAL_BORDER_RADIUS,
    DEFAULT_TOOLTIP_BORDER_RADIUS,
    DEFAULT_PROGRESS_BAR_HEIGHT,
} from "../common/constants";

// Inject default lusift global styles

const getDynamicDefaultCSS = () => {
    // TODO: Have these properties be in lusift.css too
    return `\n
    /* from dynamic javascript variables*/

    .lusift-progress {
      height: ${DEFAULT_PROGRESS_BAR_HEIGHT};
    }
    .lusift-progress::-webkit-progress-bar {
      border-radius: ${DEFAULT_TOOLTIP_BORDER_RADIUS}; /*border-radius of tooltip*/
    }
    .modal .lusift-progress::-webkit-progress-bar {
      border-radius: ${DEFAULT_MODAL_BORDER_RADIUS}; /*border-radius of modal*/
    }
    .lusift-progress::-webkit-progress-value {
      background-color: ${PRIMARY_COLOR}; /*color of progress bar*/
    }
  `;
};

export default () => {
    if (typeof document === "undefined") return;

    const lusiftDefault = document.createElement("style");
    lusiftDefault.type = "text/css";
    lusiftDefault.setAttribute("lusift-default", "");
    lusiftDefault.textContent = lusiftDefaultCSS;
    lusiftDefault.textContent += getDynamicDefaultCSS();

    const lusiftCustom = document.createElement("style");
    lusiftCustom.type = "text/css";
    lusiftCustom.setAttribute("lusift-custom", "");

    const customStyle = document.createElement("style");
    customStyle.type = "text/css";
    customStyle.setAttribute("lusift-custom-css", "");

    const docFrag = document.createDocumentFragment();
    // append all style elements to the document fragment
    docFrag.appendChild(lusiftDefault);
    docFrag.appendChild(lusiftCustom);
    docFrag.appendChild(customStyle);
    // append the document fragment to the document
    document.head.appendChild(docFrag);
};
