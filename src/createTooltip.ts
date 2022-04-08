import styleObjectToString from './utils/styleObjectToString';
import renderProgressBar from './renderProgressBar';
import createTippy from './createTippy';
import { DEFAULT_TOOLTIP_BORDER_RADIUS } from './constants';

const defaultBodyContent = `
  <h3 style="font-weight: bold;">Default title</h3>
  <p style="font-weight: normal;">Default tooltip content</p>
`;


const renderCloseXButton = (closeButton: any): string => {
  if (closeButton.disable) return;
  return `
    <style>
      .lusift .tooltip .closeX{
        ${styleObjectToString(closeButton.styleProps)}
      }
    </style>

    <section class="close-btn">
      <button onclick="Lusift.close()" class="closeX close">&times;</button>
    </section>
  `;
}

const renderNavButtons = (navSection: any): string => {
  const { nextButton, prevButton, dismissLink } = navSection;

  return `
    <style>
    .lusift .tooltip section.nav-buttons{
      ${styleObjectToString(navSection.styleProps)}
    }
    .lusift .tooltip .nav-buttons .next{
      ${styleObjectToString(nextButton.styleProps)}
    }
    .lusift .tooltip .nav-buttons .prev{
      ${styleObjectToString(prevButton.styleProps)}
    }
    </style>

    <section class="nav-buttons">
      ${dismissLink.disable ? '': `
        <button onclick="Lusift.close()" class="close dismiss-link">
          skip this
        </button>
        `}
      ${prevButton.disable ? '': `<button onclick="Lusift.prev()" class="prev lusift-button">Prev</button>`}
      ${nextButton.disable ? '': `<button onclick="Lusift.next()" class="next lusift-button">Next</button>`}
    </section>
  `;
}


const renderTooltip = ({ data, target, styleProps, actions, uid }) => {

  const { closeButton, navSection } = actions;
  const {
    arrow,
    bodyContent = defaultBodyContent,
    placement,
    offset
  } = data;

  const content = `
    <style>
      .tippy-box{
        border-radius: ${DEFAULT_TOOLTIP_BORDER_RADIUS};
        ${styleObjectToString(styleProps)}
      }
    </style>

    <div class="lusift">
      ${renderProgressBar()}
      <div class="tooltip" id="tooltip-${uid}">
        ${renderCloseXButton(closeButton)}
        <section class="body-content">
          ${bodyContent}
        </section>
        ${renderNavButtons(navSection)}
      </div>
    <div>
  `;

  const tippyInstance = createTippy({
    target,
    content,
    arrow,
    offset,
    placement,
    remove: ()=>{}
  });

  tippyInstance.show();

  return tippyInstance;
}

export default renderTooltip;
