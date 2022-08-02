import { document } from "global";
import { MODAL_OVERLAY_CLASS, MODAL_CLASS, DEFAULT_MODAL_BORDER_RADIUS, MODAL_OVERLAY_Z_INDEX } from "../common/constants";
import { styleObjectToString } from "../common/utils";
import renderProgressBar from "../common/progressBar";
import renderCloseXButton from "../common/closeXButton";

const defaultBodyContent = `
  <style>
  .lusift .modal h2 {
    font-weight: bold;
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  .lusift .modal p {
    text-align: center;
  }
  .lusift .modal .button-area {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem 0;
  }

  .lusift .modal .button-area button {
    font-size: 1.1rem;
    padding: 0.45rem 0.75rem;
  }
  </style>
  <div class="modal">
    <h2>Default Modal Content</h2>
    <p>This is the default modal content!</p>
    <div class="button-area">
      <button class="button" onclick="Lusift.next()">
        Next
      </button>
    </div>
  </div>
`;

const div = () => document.createElement("div");

export const noScrollBody = () => {
  document.body.classList.add("lusift-no-scroll");
};

export const restoreScrollBody = () => {
  document.body.classList.remove("lusift-no-scroll");
};

const createModal = ({ uid, index, closeButton, progressBar, styleProps, overlay }): () => void => {

  const modalOverlay = div();
  const modal = div();
  const lusiftWrapper = div();
  modalOverlay.classList.add(MODAL_OVERLAY_CLASS);
  modal.id = uid;
  modal.classList.add(MODAL_CLASS);
  lusiftWrapper.classList.add("lusift");
  modal.innerHTML = `
    <style>
      .lusift-progress {
        ${styleObjectToString({
          ...progressBar.styleProps,
          backgroundColor: undefined
        })}
      }
      .lusift-progress::-webkit-progress-bar {
        ${styleObjectToString({
          ...progressBar.styleProps,
          backgroundColor: undefined
        })}
      }
      .lusift-progress::-webkit-progress-value {
        ${styleObjectToString(progressBar.styleProps)}
      }

      .lusift-progress::-moz-progress-bar {
        initial: none;
        ${styleObjectToString({
          ...progressBar.styleProps,
          backgroundColor: undefined
        })}
      }
    </style>
    ${renderCloseXButton(closeButton, "modal")}
    <section class="body-content">
    </section>
  `;

  if (!progressBar.disabled) {
    modal.prepend(renderProgressBar());
  }

  Object.assign(modalOverlay.style, {
    position: 'fixed',
    overflowY: "scroll",
    background: "rgba(40,40,40, .5)",
    top: "0",
    left: "0",
    bottom: "0",
    right: "0",
    zIndex: MODAL_OVERLAY_Z_INDEX,
    ...overlay.styleProps
  });

  Object.assign(modal.style, {
    margin: '15vh auto',
    width: '80%',
    maxWidth: '650px',
    background: 'rgba(255,255,255, 1)',
    position: 'relative',
    borderRadius: DEFAULT_MODAL_BORDER_RADIUS,
    ...styleProps
  });

  lusiftWrapper.appendChild(modal);
  modalOverlay.appendChild(lusiftWrapper);
  document.body.appendChild(modalOverlay);

  const Lusift = window["Lusift"];

  let bodyContent = defaultBodyContent;
  const activeGuide = Lusift.getActiveGuide();

  if (activeGuide) {
    bodyContent = Lusift.getContent()[activeGuide.id].data.steps[index].data.bodyContent || bodyContent;
  }

  Lusift.render(bodyContent, ".lusift > .modal > .body-content");
  noScrollBody();

  return function destroyModal() {
    document.body.removeChild(modalOverlay);
    restoreScrollBody();
  };
};

export default createModal;
