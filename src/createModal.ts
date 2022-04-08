import { document } from 'global';
import { styleObjectToString } from './utils';
import { MODAL_OVERLAY_CLASS, DEFAULT_MODAL_BORDER_RADIUS } from './constants';
import renderProgressBar from './renderProgressBar';
import renderCloseXButton from './renderCloseXButton';

// TODO onNext, onPrev, onClose not working

const createModal = ({ uid, bodyContent, closeButton }): void => {
  const modalOverlay = document.createElement('div');
  const modal = document.createElement('div');
  modal.id = uid;
  modalOverlay.classList.add(MODAL_OVERLAY_CLASS);

  const modalStyleProps = {};
  const modalOverlayStyleProps = {};
  bodyContent = bodyContent || "<h2>Default Modal Content</h2>";
  closeButton = closeButton || {};

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
  modal.classList.add('modal');

  modal.innerHTML = `
  ${renderProgressBar()}
  ${renderCloseXButton(closeButton, 'modal')}
    <section class="body-content">
      ${bodyContent}
      <div>
        <button class="button" onclick="Lusift.next()">OK</button>
      </div>
    </section>
  `;
  const lusiftWrapper = document.createElement('div');
  lusiftWrapper.classList.add('lusift');
  lusiftWrapper.appendChild(modal);

  document.body.appendChild(modalOverlay);
  document.body.appendChild(lusiftWrapper);
}

export default createModal;
