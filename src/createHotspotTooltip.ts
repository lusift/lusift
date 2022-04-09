import styleObjectToString from './utils/styleObjectToString';
import createTippy from './createTippy';
import renderProgressBar from './renderProgressBar';
import { DEFAULT_TOOLTIP_BORDER_RADIUS } from './constants';

const defaultBodyContent = `
  <h3 style="font-weight: bold;">Default title</h3>
  <p style="font-weight: normal;">Default tooltip content</p>
`;

const renderTooltip = ({ remove, data, target, styleProps, uid }) => {

  const {
    arrow,
    placement,
    offset,
    bodyContent = defaultBodyContent,
  } = data;

  const content = `
    <style>
      .tippy-box{
        z-index: 999999;
        border-radius: ${DEFAULT_TOOLTIP_BORDER_RADIUS};
        ${styleObjectToString(styleProps)}
      }
    </style>

    ${renderProgressBar()}
    <div class="lusift">
      <div class="hotspot-tooltip" id="tooltip-${uid}">
        <section class="body-content">
          ${bodyContent}
        </section>
      </div>
    </div>
  `;

  const tippyInstance = createTippy({
    target,
    content,
    arrow,
    offset,
    placement,
    remove
  });

  return tippyInstance;
}

export default renderTooltip;
