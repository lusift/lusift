import { document, window } from 'global';
import tippy, { inlinePositioning, Instance as TippyInstance } from 'tippy.js';
import styleObjectToString from './utils/styleObjectToString';
import popperOptions from './popperOptions';

const defaultBodyContent = `
  <h3 style="font-weight: bold;">Default title</h3>
  <p style="font-weight: normal;">Default tooltip content</p>
`;

// TODO full-feature this
// TODO Add other positions like bottom-start and so on

const closeXButton = (closeButton: any): string => {
  if (closeButton.disable) return;
  return `
    <style>
    div.section.close-btn{
      display: flex;
      justify-content: flex-end;
      margin: -4px !important;
    }
    .closeX{
      /*
      border: 1px solid blue;
      */
      margin: -4px -5px !important;
      margin-bottom: 0 !important;
      font-weight: normal;
      font-size: 1rem;
      padding: 0 2px;
      color: #666;
      ${styleObjectToString(closeButton.styleProps)}
    }
    </style>

    <div class="section close-btn">
      <button class="closeX close">&times;</button>
    </div>
  `;
}

const navButtons = (navSection: any): string => {
  const { nextButton, prevButton, dismissLink } = navSection;

  return `
    <style>
    .section.nav-buttons{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 4px !important;
      ${styleObjectToString(navSection.styleProps)}
    }
    .nav-buttons .dismiss-link{
      color: #777;
      font-style: italic;
      font-size: 0.8rem;
      margin-right: 0.4rem;
    }
    .nav-buttons .next, .nav-buttons .prev{
      color: #fff;
      background-color: rgb(17, 153, 158);
      padding: 0.2rem 0.35rem;
      font-size: 0.75rem;
      font-weight: bold;
      border-radius: 8px;
    }
    .nav-buttons .next{
      ${styleObjectToString(nextButton.styleProps)}
    }
    .nav-buttons .prev{
      margin-right: 0.3rem;
      ${styleObjectToString(prevButton.styleProps)}
    }
    </style>

    <div class="nav-buttons section">
      ${dismissLink.disable ? '': `
        <button class="close dismiss-link">
          skip this
        </button>
        `}
      ${prevButton.disable ? '': `<button class="prev">Prev</button>`}
      ${nextButton.disable ? '': `<button class="next">Next</button>`}
    </div>
  `;
}

const renderTooltip = ({ remove, bodyContent = defaultBodyContent,
                       arrow, placement,
                       target, styleProps, actions,
                       offset, uid, nextStep, prevStep }) => {

  const { closeButton, navSection } = actions;

  const content = `
    <style>
      .tippy-box{
        z-index: 999999;
        ${styleObjectToString(styleProps)}
      }
      #tooltip-${uid} {
        font-weight: bold;
        font-size: 1rem;
        display: block;
      }
      #tooltip-${uid} > * {
        margin: 3px 6px;
      }
      .section.body-content{
        margin-top: 0 !important;
        min-width: 80px;
      }
    </style>

    <div id="tooltip-${uid}">
    ${closeXButton(closeButton)}
    <div class="section body-content">
      ${bodyContent}
    </div>
    ${navButtons(navSection)}
    <!--
    <div class="dismiss-link section">
      <button class="close dismiss-link">
        skip this
      </button>
    </div>
    -->
    </div>
  `;

  const tippyInstance = tippy(target, {
    allowHTML: true,
    content,
    interactive: true,
    zIndex: 99999,
    arrow,
    hideOnClick: false,
    inlinePositioning: true,
    plugins: [inlinePositioning],
    moveTransition: 'transform 0.2s ease-out',
    offset,
    placement,
    onClickOutside(instance, event) {
      // Probably give this option for hotspots
    },
    popperOptions: {
      strategy: 'fixed',
      ...popperOptions,
      placement,
      modifiers: [
        ...popperOptions.modifiers,
        /* {
          name: 'flip',
          enabled: placement === 'auto',
        }, */
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
  console.log(tippyInstance)

  tippyInstance.show();
  window.ti = tippyInstance;

  const closeButtons = document.querySelectorAll(`#tooltip-${uid} .close`);
  const nextButtons = document.querySelectorAll(`#tooltip-${uid} button.next`);
  const prevButtons = document.querySelectorAll(`#tooltip-${uid} button.prev`);

  closeButtons.forEach(btn => btn.addEventListener('click', remove));
  nextButtons.forEach(btn => btn.addEventListener('click', nextStep));
  prevButtons.forEach(btn => btn.addEventListener('click', prevStep));

  return tippyInstance;
}

export default renderTooltip;
