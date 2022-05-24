import { document } from "global";
import { MODAL_OVERLAY_CLASS, MODAL_CLASS, DEFAULT_MODAL_BORDER_RADIUS, MODAL_OVERLAY_Z_INDEX } from "../common/constants";
import renderProgressBar from "../common/progressBar";
import renderCloseXButton from "../common/closeXButton";

const defaultBodyContent = `
  <style>
  .body-content h2{
    font-weight: bold;
    font-size: 1.5rem;
  }
  .body-content .button-area{
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2rem 0;
  }
  </style>
  <h2>Default Modal Content</h2>
  <p>some text</p>
  <div class="button-area">
  <button class="button" onclick="Lusift.next()">
  Next
  </button>
  </div>`;

const div = () => document.createElement("div");

export const noScrollBody = () => {
  document.body.classList.add("lusift-no-scroll");
};

export const restoreScrollBody = () => {
  document.body.classList.remove("lusift-no-scroll");
};

const createModal = ({ uid, index, closeButton = {} }): void => {

  const modalOverlay = div();
  const modal = div();
  const lusiftWrapper = div();
  modalOverlay.classList.add(MODAL_OVERLAY_CLASS);
  modal.id = uid;
  modal.classList.add(MODAL_CLASS);
  lusiftWrapper.classList.add("lusift");
  modal.innerHTML = `
    ${renderProgressBar()}
    ${renderCloseXButton(closeButton, "modal")}
    <section class="body-content">
    </section>
  `;

  Object.assign(modalOverlay.style, {
    position:  'fixed',
    overflowY: "scroll",
    background: "rgba(40,40,40, .55)",
    top: "0",
    left: "0",
    bottom: "0",
    right: "0",
    zIndex: MODAL_OVERLAY_Z_INDEX,
  });

  Object.assign(modal.style, {
    margin: '15vh auto',
    width: '80%',
    maxWidth: '650px',
    background: 'rgba(255,255,255, 1)',
    position: 'relative',
    borderRadius: DEFAULT_MODAL_BORDER_RADIUS,
  });

  lusiftWrapper.appendChild(modal);
  modalOverlay.appendChild(lusiftWrapper);
  document.body.appendChild(modalOverlay);

  const Lusift = window["Lusift"];

  const bodyContent =
    Lusift.getContent()[Lusift.getActiveGuide().id].data.steps[index].data.bodyContent ||
    defaultBodyContent;

  Lusift.render(bodyContent, ".lusift > .modal > .body-content");
};

export default createModal;
