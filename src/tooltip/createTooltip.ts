import renderProgressBar from "../common/progressBar";
import renderCloseXButton from "../common/closeXButton";
import createTooltip from "../common/createTooltip";
import { DEFAULT_TOOLTIP_BORDER_RADIUS } from "../common/constants";
import { styleObjectToString } from '../common/utils';
import { log } from "../common/logger";
import { StepActions } from '../common/types';

const defaultBodyContent = `
  <h3 style="font-weight: bold;">Default title</h3>
  <p style="font-weight: normal;">Default tooltip content</p>
`;

const div = () => document.createElement("div");
const section = () => document.createElement("section");
const button = () => document.createElement("button");

const renderFooter = (navSection: StepActions['navSection']): Element => {
    const { nextButton, prevButton, dismissLink, disabled } = navSection;
    if (disabled) return div();

    const container = section();
    container.className = 'nav-buttons';
    const dismiss = button();
    dismiss.className = 'close dismiss-link';
    dismiss.innerText = dismissLink.text;
    dismiss.setAttribute('onclick', 'window.Lusift.close()');

    const prev = button();
    prev.className = 'prev';
    prev.innerText = prevButton.text;
    prev.setAttribute('onclick', 'window.Lusift.prev()');
    const next = button();
    next.className = 'next lusift-button';
    next.innerText = nextButton.text;
    next.setAttribute('onclick', 'window.Lusift.next()');

    Object.assign(dismiss.style, dismissLink.styleProps);
    Object.assign(next.style, nextButton.styleProps);
    Object.assign(prev.style, prevButton.styleProps);

    const prevNextBtns = div();
    prevNextBtns.className = 'prev-next-btns';

    !dismissLink.disabled && container.appendChild(dismiss);
    !prevButton.disabled && prevNextBtns.appendChild(prev);
    !nextButton.disabled && prevNextBtns.appendChild(next);
    container.appendChild(prevNextBtns);

    return container;
};

const renderTooltip = async ({ data, target, styleProps, actions, uid, index, onShow, onHide, scrollIntoView }) => {
  const { closeButton, navSection } = actions;
  const {
    arrow,
    // bodyContent = defaultBodyContent,
    placement,
    offset,
    maxWidth,
    progressBar,
    arrowSizeScale
  } = data;

  const content = div();
  content.className = 'lusift';

  content.innerHTML = `
      <style>
      .lusift-progress {
        ${styleObjectToString({
          ...progressBar.styleProps,
          backgroundColor: undefined
        })}
      }
      .lusift-progress::-webkit-progress-bar {
        ${styleObjectToString({
          ...progressBar.styleProps,
          backgroundColor: undefined
        })}
      }
      .lusift-progress::-webkit-progress-value {
        ${styleObjectToString(progressBar.styleProps)}
      }

      .lusift-progress::-moz-progress-bar {
          initial: none;
        ${styleObjectToString({
          ...progressBar.styleProps,
          backgroundColor: undefined
        })}
      }
      </style>
    <div aria-label="tooltip" class="tooltip" id="tooltip-${uid}">
      ${renderCloseXButton(closeButton, "tooltip")}
      <section class="body-content">
      </section>
      <section class="footer">
      </section>
    </div>
  `;
  if (!progressBar.disabled) {
    content.prepend(renderProgressBar());
  }
  content.querySelector(`#tooltip-${uid}`)!.appendChild(renderFooter(navSection));

  Object.assign(content.style, {
    borderRadius: DEFAULT_TOOLTIP_BORDER_RADIUS,
    ...styleProps
  })

  const Lusift = window["Lusift"];

  let bodyContent = defaultBodyContent;
  let footerContent = null;
  const activeGuide = Lusift.getActiveGuide();

  if (activeGuide) {
    bodyContent = Lusift.getContent()[activeGuide.id].data.steps[index].data.bodyContent || bodyContent;
    footerContent = Lusift.getContent()[activeGuide.id].data.steps[index].data.footerContent || footerContent;
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
      // TODO: the second render call breaks Lusift on vue, commenting out for now
      /* Lusift.render(footerContent, ".lusift > .tooltip > .footer", () => {
      }); */
    },
    scrollIntoView,
    arrowSizeScale,
    showOnCreate: true
  });
  // tooltipInstance.show(true)

  return tooltipInstance;
};

export default renderTooltip;
