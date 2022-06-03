import { styleObjectToString } from "../common/utils";
import renderProgressBar from "../common/progressBar";
import renderCloseXButton from "../common/closeXButton";
import createTooltip from "../common/createTooltip";
import { DEFAULT_TOOLTIP_BORDER_RADIUS } from "../common/constants";
import { log } from "../common/logger";

const defaultBodyContent = `
  <h3 style="font-weight: bold;">Default title</h3>
  <p style="font-weight: normal;">Default tooltip content</p>
`;

// TODO: Enable styleProps

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
      ${
          dismissLink.disabled
              ? ""
              : `
        <button onclick="Lusift.close()" class="close dismiss-link">
          ${dismissLink.text}
        </button>
        `
      }
      ${
          prevButton.disabled
              ? ""
              : `<button onclick="Lusift.prev()" class="prev lusift-button">${prevButton.text}</button>`
      }
      ${
          nextButton.disabled
              ? ""
              : `<button onclick="Lusift.next()" class="next lusift-button">${nextButton.text}</button>`
      }
    </section>
  `;
};

const renderTooltip = async ({ data, target, styleProps, actions, uid, index, onShow, onHide, scrollIntoView }) => {
    const { closeButton, navSection } = actions;
    const {
        arrow,
        // bodyContent = defaultBodyContent,
        placement,
        offset,
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
        ${renderCloseXButton(closeButton, "tooltip")}
        <section class="body-content">
        </section>
        ${renderNavButtons(navSection)}
      </div>
    <div>
  `;

    const Lusift = window["Lusift"];

    let bodyContent = defaultBodyContent;
    const activeGuide = Lusift.getActiveGuide();

    if (activeGuide) {
      bodyContent = Lusift.getContent()[activeGuide.id].data.steps[index].data.bodyContent;
    }
    window['bodyContent'] = bodyContent;

    const tooltipInstance = await createTooltip({
        target,
        content,
        arrow,
        offset,
        placement,
        remove: () => {},
        onShow,
        onHide,
        onBeforeFirstRender: () => {
          Lusift.render(bodyContent, ".lusift > .tooltip > .body-content", () => {
          });
        },
        scrollIntoView,
        showOnCreate: true
    });
    // tooltipInstance.show(true)

    return tooltipInstance;
};

export default renderTooltip;
