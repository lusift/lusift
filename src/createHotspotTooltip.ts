import tippy, { inlinePositioning, Instance as TippyInstance } from 'tippy.js';
import styleObjectToString from './utils/styleObjectToString';
import popperOptions from './popperOptions';

const defaultBodyContent = `
  <h3 style="font-weight: bold;">Default title</h3>
  <p style="font-weight: normal;">Default tooltip content</p>
`;

// TODO full-feature this
// TODO controlling width of tooltip

const renderTooltip = ({ remove, bodyContent = defaultBodyContent,
                       arrow, placement,
                       target, styleProps,
                       offset, uid}) => {
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
        min-width: 100px;
      }
    </style>

    <div id="tooltip-${uid}">
    <div class="section body-content">
      ${bodyContent}
    </div>
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
      remove();
      // Probably give this option for hotspots
    },
    popperOptions: {
      ...popperOptions,
      placement,
      modifiers: [
        ...popperOptions.modifiers,
        {
          name: 'flip',
          enabled: placement === 'auto',
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
  console.log(tippyInstance);

  // tippyInstance.show();

  return tippyInstance;
}

export default renderTooltip;
