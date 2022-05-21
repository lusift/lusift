import styleObjectToString from "../common/utils/styleObjectToString";
import createTooltip from "../common/createTooltip";
import renderProgressBar from "../common/progressBar";
import { DEFAULT_TOOLTIP_BORDER_RADIUS } from "../common/constants";

const defaultBodyContent = `
  <h3 style="font-weight: bold;">Default title</h3>
  <p style="font-weight: normal;">Default tooltip content</p>
`;

const renderTooltip = async ({ remove, data, target, styleProps, uid, index, onClickOutside, showOnCreate }) => {
    const {
        arrow,
        placement,
        offset,
        // bodyContent = defaultBodyContent,
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
        </section>
      </div>
    </div>
  `;

    const tooltipInstance = await createTooltip({
        target,
        content,
        arrow,
        offset,
        placement,
        onClickOutside,
        hideOnReferenceHidden: false,
        hideOnTooltipEscape: false,
        showOnCreate,
        remove: () => {},
    });

    const Lusift = window["Lusift"];

    const bodyContent =
        Lusift.getContent()[Lusift.getActiveGuide().id].data.steps[index].tip.data.bodyContent ||
        defaultBodyContent;

    Lusift.render(bodyContent, ".lusift > .hotspot-tooltip > .body-content", () => {
        tooltipInstance.update();
    });

    return tooltipInstance;
};

export default renderTooltip;
