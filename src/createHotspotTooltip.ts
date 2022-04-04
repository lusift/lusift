import styleObjectToString from './utils/styleObjectToString';
import createTippy from './createTippy';
import renderProgressBar from './renderProgressBar';

const defaultBodyContent = `
  <h3 style="font-weight: bold;">Default title</h3>
  <p style="font-weight: normal;">Default tooltip content</p>
`;

// TODO full-feature this

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
        ${styleObjectToString(styleProps)}
      }
      #tooltip-${uid} {
        font-weight: bold;
        font-size: 1rem;
        display: block;
        padding: 5px 9px;
      }
      #tooltip-${uid} > * {
        margin: 3px 6px;
      }
      .section.body-content{
        margin-top: 0 !important;
        min-width: 100px;
      }
    </style>

    ${renderProgressBar()}
    <div id="tooltip-${uid}">
      <div class="section body-content">
        ${bodyContent}
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
