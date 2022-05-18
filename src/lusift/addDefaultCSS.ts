import { window, document } from "global";
import lusiftDefaultCSS from "./style/lusift.css";

// Inject default lusift global styles
export default () => {
    if (typeof document === "undefined") return;

    const lusiftDefault = document.createElement("style");
    lusiftDefault.type = "text/css";
    lusiftDefault.setAttribute("lusift-default", "");
    lusiftDefault.textContent = lusiftDefaultCSS;

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
