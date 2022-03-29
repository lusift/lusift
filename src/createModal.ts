import { document } from 'global';
import { styleObjectToString } from './utils';

// TODO custom functions - developer can pass functions in something like Lusift.method('method-id', method)
// TODO set option for automatic redirect in actions{} (with wildcard feature in the link)
// TODO only one content at a time
// TODO - Lusift.next() Lusift.prev() Lusift.close() Lusift.goto(2) Lusift.showContent('contentID')
// TODO see what buttons and how they should work and display for modals and tooltips
// TODO make it easier to write html and css. Maybe see how a developer can choose to use ui frameworks.

const async = {
  leading: true,
  following: true
}

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
      margin-right: 0.15rem;
      color: #666;
      ${styleObjectToString(closeButton.styleProps)}
    }
    </style>

    <div class="section close-btn">
      <button class="closeX close">&times;</button>
    </div>
  `;
}

const createModal = (): void => {
  const modalOverlay = document.createElement('div');
  const modal = document.createElement('div');
  const modalID = 'some-modal-id';
  modal.id = modalID;
  modalOverlay.classList.add('lusift-modal-container');

  const modalStyleProps = {};
  const modalOverlayStyleProps = {};
  const bodyContent = "<h2>Modal Content</h2>";

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
    borderRadius: '4px',
    background: '#fff',
    height: '500px',
    width: '600px',
    top: '50%',
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
  }
  </style>
  ${renderCloseXButton(closeButton)}
    <div class="section body-content">
      ${bodyContent}
    </div>
  `;

  // modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);
  document.body.appendChild(modal);
}

export default createModal;
