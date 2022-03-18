import { document, window } from 'global';
import tippy, { inlinePositioning, Instance as TippyInstance } from 'tippy.js';
import popperOptions from './popperOptions';

const defaultBodyContent = `
  <h3 style="font-weight: bold;">Default title</h3>
  <p style="font-weight: normal;">Default tooltip content</p>
`;


const renderTooltip = ({ remove, bodyContent = defaultBodyContent, arrow, placement, target, offset, uid, nextStep, prevStep }) => {

  const content = `
  <style>
  #tooltip-${uid} {
    // background: #ccc;
    font-weight: bold;
    font-size: 1rem;
    display: block;
  }
  #tooltip-${uid} > * {
    margin: 4px 12px;
  }
  .tippy-box{
    background: #ccc;
  }
  </style>
  <div id="tooltip-${uid}">
  <div class="body-content">
  ${bodyContent}
  </div>
  <div class="nav-buttons section" style="display: flex">
  <button class="close" style="border: 1px solid black; background: #888;">Close</button>
  <button class="prev" style="border: 1px solid black; background: #888;">Prev</button>
  <button class="next" style="border: 1px solid black; background: #888;">Next</button>
  </div>
  <div class="dismiss-link section">
  <button class="close">dismiss link</button>
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

  const closeButtons = document.querySelectorAll(`#tooltip-${uid} button.close`);
  const nextButtons = document.querySelectorAll(`#tooltip-${uid} button.next`);
  const prevButtons = document.querySelectorAll(`#tooltip-${uid} button.prev`);

  closeButtons.forEach(btn => btn.addEventListener('click', remove));
  nextButtons.forEach(btn => btn.addEventListener('click', nextStep));
  prevButtons.forEach(btn => btn.addEventListener('click', prevStep));

  return tippyInstance;
}

// TODO full-feature this
export default renderTooltip;
