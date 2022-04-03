import { document } from 'global';
import { styleObjectToString } from './utils';
import { MODAL_OVERLAY_CLASS, DEFAULT_MODAL_BORDER_RADIUS } from './constants';
import renderProgressBar from './renderProgressBar';

// TODO set option for automatic redirect in actions{} (with wildcard feature in the link)
// TODO make it easier to write html and css. Maybe see how a developer can choose to use ui frameworks.

const closeButton = {
  styleProps: {},
  disable: false,
}

const renderCloseXButton = (closeButton: any): string => {
  if (closeButton.disable) return;
  return `
    <style>
    div.section.close-btn{
      display: flex;
      justify-content: flex-end;
    }
    .closeX{
      /*
      border: 1px solid blue;
      */
      margin-bottom: 0 !important;
      font-weight: normal;
      font-size: 1.25rem;
      padding: 0 2px;
      margin-right: 0.2rem;
      color: #666;
      ${styleObjectToString(closeButton.styleProps)}
    }
    </style>

    <div class="section close-btn">
      <button onclick="window.Lusift.close()" class="closeX close">&times;</button>
    </div>
  `;
}

const createModal = ({ uid, bodyContent }): void => {
  const modalOverlay = document.createElement('div');
  const modal = document.createElement('div');
  modal.id = uid;
  modalOverlay.classList.add(MODAL_OVERLAY_CLASS);

  const modalStyleProps = {};
  const modalOverlayStyleProps = {};
  bodyContent = bodyContent || "<h2>Modal Content</h2>";

  modalOverlay.style.cssText = styleObjectToString({
    position: 'absolute',
    background: '#444',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: '0.5',
    top: '0',
    left: '0',
    bottom: '0',
    right: '0',
    zIndex: '99998',
    ...modalOverlayStyleProps
  });

  modal.style.cssText = styleObjectToString({
    borderRadius: DEFAULT_MODAL_BORDER_RADIUS,
    background: '#fff',
    height: '500px',
    width: '600px',
    top: '50%',
    display: 'flex',
    flexDirection: 'column',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    zIndex: '99999',
    opacity: '1',
    ...modalStyleProps
  });

  modal.innerHTML = `
  <style>
    .section.body-content{
      padding: 3px 15px;
      color: #111;
      background: #fff;
      border: 1px solid red;
      flex-grow: 1;
    }

    .button{
      color: #fff;
      background-color: rgb(17, 153, 158);
      padding: 0.2rem 0.35rem;
      font-size: 0.75rem;
      font-weight: bold;
      border-radius: 8px;
    }
  </style>
  ${renderProgressBar()}
  ${renderCloseXButton(closeButton)}
    <div class="section body-content">
      ${bodyContent}
      <div>
        <button class="button" onclick="Lusift.next()">OK</button>
      </div>
    </div>
  `;

  // modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);
  document.body.appendChild(modal);
}

export default createModal;
