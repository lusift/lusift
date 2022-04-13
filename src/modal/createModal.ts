import { document } from 'global';
import { styleObjectToString } from '../common/utils';
import { MODAL_OVERLAY_CLASS, DEFAULT_MODAL_BORDER_RADIUS } from '../common/constants';
import renderProgressBar from '../common/progressBar';
import renderCloseXButton from '../common/closeXButton';


const createModal = ({ uid, bodyContent, closeButton={} }): void => {
  const modalOverlay = document.createElement('div');
  const modal = document.createElement('div');
  modal.id = uid;
  modalOverlay.classList.add(MODAL_OVERLAY_CLASS);

  const modalStyleProps = {};
  const modalOverlayStyleProps = {};
  bodyContent = bodyContent || `
    <style>
      height: 500px;
      width: 600px;
    </style>
    <div>
      <h2>Default Modal Content</h2>
      <button class="button" onclick="Lusift.next()">OK</button>
    </div>`;

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
    ...modalStyleProps
  });
  modal.classList.add('modal');

  modal.innerHTML = `
    ${renderProgressBar()}
    ${renderCloseXButton(closeButton, 'modal')}
    <section class="body-content">
      ${bodyContent}
    </section>
  `;
  const lusiftWrapper = document.createElement('div');
  lusiftWrapper.classList.add('lusift');
  lusiftWrapper.appendChild(modal);

  document.body.appendChild(modalOverlay);
  document.body.appendChild(lusiftWrapper);
}

export default createModal;
