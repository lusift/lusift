import { document, window } from 'global';
import tippy, { inlinePositioning, Instance as TippyInstance } from 'tippy.js';
import popperOptions from './popperOptions';

const defaultBodyContent = `
  <h3 style="font-weight: bold;">Default title</h3>
  <p style="font-weight: normal;">Default tooltip content</p>
`;

// Add other positions like bottom-start and so on

const closeXButton = () => {
  return `
  <style>
  div.section.close-btn{
    display: flex;
    justify-content: flex-end;
    margin: -4px !important;
  }
  .closeX{
    color: #666;
    /*
    border: 1px solid blue;
    */
    margin: -4px -6px !important;
    margin-bottom: 0 !important;
    font-weight: normal;
    font-size: 1rem;
    padding: 0 2px;
  }
  </style>

  <div class="section close-btn">
    <button class="closeX close">&times;</button>
  </div>
  `;
}

const renderTooltip = ({ remove, bodyContent = defaultBodyContent, arrow, placement, target, offset, uid, nextStep, prevStep }) => {

  const content = `
    <style>
    #tooltip-${uid} {
      font-weight: bold;
      font-size: 1rem;
      display: block;
    }
    #tooltip-${uid} > * {
      margin: 3px 6px;
      border: 1px solid green;
    }
    .tippy-box{
      background: #ccc;
    }

    .dismiss-link{
      padding: 0;
    }

    </style>

    <div id="tooltip-${uid}">
    ${closeXButton()}
    <div class="body-content">
      ${bodyContent}
    </div>
    <div class="nav-buttons section" style="display: flex">
      <button class="prev" style="border: 1px solid black; background: #888;">Prev</button>
      <button class="next" style="border: 1px solid black; background: #888;">Next</button>
    </div>
    <div class="dismiss-link section">
      <button class="close dismiss-link">
        skip this
      </button>
    </div>
    </div>
  `;

  const tippyInstance = tippy(target, {
    allowHTML: true,
    content,
    interactive: true,
    arrow,
    hideOnClick: false,
    inlinePositioning: true,
    plugins: [inlinePositioning],
    moveTransition: 'transform 0.2s ease-out',
    offset: offset || [0, 10],
    placement,
    onClickOutside(instance, event) {
      // Probably give this option for hotspots
    },
    popperOptions: {
      ...popperOptions,
      placement,
      modifiers: [
        ...popperOptions.modifiers,
        {
          name: 'flip',
          enabled: placement === 'auto'
        },
        {
          name: 'arrow',
          enabled: arrow
        }
      ]
    },
    showOnCreate: true,
    trigger: 'manual',
    theme: 'light'
  });

  tippyInstance.show();
  console.log(tippyInstance);

  const closeButtons = document.querySelectorAll(`#tooltip-${uid} .close`);
  const nextButtons = document.querySelectorAll(`#tooltip-${uid} button.next`);
  const prevButtons = document.querySelectorAll(`#tooltip-${uid} button.prev`);

  closeButtons.forEach(btn => btn.addEventListener('click', remove));
  nextButtons.forEach(btn => btn.addEventListener('click', nextStep));
  prevButtons.forEach(btn => btn.addEventListener('click', prevStep));

  return tippyInstance;
}

// TODO full-feature this
export default renderTooltip;
