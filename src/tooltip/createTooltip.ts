import renderProgressBar from "../common/progressBar";
import renderCloseXButton from "../common/closeXButton";
import createTooltip from "../common/createTooltip";
import { DEFAULT_TOOLTIP_BORDER_RADIUS } from "../common/constants";
import { log } from "../common/logger";

const defaultBodyContent = `
  <h3 style="font-weight: bold;">Default title</h3>
  <p style="font-weight: normal;">Default tooltip content</p>
`;

const div = () => document.createElement("div");
const section = () => document.createElement("section");

const renderNavButtons = (navSection: any): Element => {
    const { nextButton, prevButton, dismissLink, disabled } = navSection;
    if (disabled) return div();

    const container = section();
    container.className = 'nav-buttons';
    const dismiss = document.createElement('button');
    dismiss.className = 'close dismiss-link';
    dismiss.innerText = dismissLink.text;
    dismiss.setAttribute('onclick', 'window.Lusift.close()');

    const prev = document.createElement('button');
    prev.className = 'prev';
    prev.innerText = prevButton.text;
    prev.setAttribute('onclick', 'window.Lusift.prev()');
    const next = document.createElement('button');
    next.className = 'next lusift-button';
    next.innerText = nextButton.text;
    next.setAttribute('onclick', 'window.Lusift.next()');

    Object.assign(dismiss.style, dismissLink.styleProps);
    Object.assign(next.style, nextButton.styleProps);
    Object.assign(prev.style, prevButton.styleProps);

    dismissLink && container.appendChild(dismiss);
    prevButton && container.appendChild(prev);
    nextButton && container.appendChild(next);

    return container;
};

const renderTooltip = async ({ data, target, styleProps, actions, uid, index, onShow, onHide, scrollIntoView }) => {
  const { closeButton, navSection } = actions;
  const {
    arrow,
    // bodyContent = defaultBodyContent,
    placement,
    offset,
    maxWidth
  } = data;

  const content = div();
  content.className = 'lusift';

  content.innerHTML = `
    ${renderProgressBar()}
    <div class="tooltip" id="tooltip-${uid}">
      ${renderCloseXButton(closeButton, "tooltip")}
      <section class="body-content">
      </section>
    </div>
  `;
  content.querySelector(`#tooltip-${uid}`)!.appendChild(renderNavButtons(navSection));

  Object.assign(content.style, {
    borderRadius: DEFAULT_TOOLTIP_BORDER_RADIUS,
    ...styleProps
  })

  const Lusift = window["Lusift"];

  let bodyContent = defaultBodyContent;
  const activeGuide = Lusift.getActiveGuide();

  if (activeGuide) {
    bodyContent = Lusift.getContent()[activeGuide.id].data.steps[index].data.bodyContent || bodyContent;
  }

  const tooltipInstance = await createTooltip({
    target,
    content,
    arrow,
    offset,
    maxWidth,
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
