import createTooltip from "../common/createTooltip";
import renderProgressBar from "../common/progressBar";
import { DEFAULT_TOOLTIP_BORDER_RADIUS } from "../common/constants";

const defaultBodyContent = `
  <h3 style="font-weight: bold;">Default title</h3>
  <p style="font-weight: normal;">Default hotspot tip content</p>
`;

const div = () => document.createElement("div");

const renderTooltip = async ({ remove, data, target, styleProps, uid, index, onClickOutside, showOnCreate }) => {
  const {
    arrow,
    placement,
    offset,
    // bodyContent = defaultBodyContent,
  } = data;

  const content = div();
  content.className = 'lusift';

  content.innerHTML = `
    ${renderProgressBar()}
    <div class="hotspot-tooltip" id="tooltip-${uid}">
    <section class="body-content">
    </section>
    </div>
  `;
  Object.assign(content.style, {
    borderRadius: DEFAULT_TOOLTIP_BORDER_RADIUS,
    ...styleProps,
  });

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

  let bodyContent = defaultBodyContent;
  const activeGuide = Lusift.getActiveGuide();

  if (activeGuide) {
    // TODO: Why did we decide to pull from Lusift.getContent() and not from this function's parameter again?
    bodyContent = Lusift.getContent()[activeGuide.id].data.steps[index].tip.data.bodyContent || bodyContent;
  }

  Lusift.render(bodyContent, `.lusift > .hotspot-tooltip#tooltip-${uid} > .body-content`, () => {
    tooltipInstance.update();
  });

  return tooltipInstance;
};

export default renderTooltip;
