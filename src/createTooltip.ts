import { document, window } from 'global';

const defaultBodyContent = `
        <h3 style="font-weight: bold;">Default title</h3>
        <p style="font-weight: normal;">Default tooltip content</p>
`;

// TODO full-feature this
const createTooltip = ({ remove, bodyContent = defaultBodyContent, toShowArrow, uid, nextStep, prevStep }) => {

  const tooltip = document.createElement('div');
  tooltip.id=`tooltip-${uid}`;
  tooltip.role='tooltip';

  // TODO css selectors in css declarations and html content should be prepended
  // with tooltip uid here to isolate the style to this element alone

  tooltip.innerHTML=`
        <style>
        #tooltip-${uid} {
            background: #ccc;
            font-weight: bold;
            padding: 4px 8px;
            font-size: 13px;
            border-radius: 4px;
            display: block;
            z-index: 9999;
          }
        </style>
        <div class="body-content">
          ${bodyContent}
        </div>
        <div style="display: flex">
          <button class="close" style="border: 1px solid black; background: #888;">Close</button>
          <button class="prev" style="border: 1px solid black; background: #888;">Prev</button>
          <button class="next" style="border: 1px solid black; background: #888;">Next</button>
        </div>
    `;

  if(toShowArrow) {
    const arrow = document.createElement('div');
    arrow.classList.add('arrow');
    arrow.setAttributeNode(document.createAttribute('data-popper-arrow'));

    arrow.innerHTML=`
        <style>
     .arrow,
      .arrow::before {
        position: absolute;
        width: 8px;
        height: 8px;
        background: inherit;
        z-index: 100;
      }

      .arrow {
        visibility: hidden;
      }

      .arrow::before {
        visibility: visible;
        content: '';
        transform: rotate(45deg);
      }

      #tooltip-${uid}[data-popper-placement^='top'] > .arrow {
        bottom: -4px;
      }

      #tooltip-${uid}[data-popper-placement^='bottom'] > .arrow {
        top: -4px;
      }

      #tooltip-${uid}[data-popper-placement^='left'] > .arrow {
        right: -4px;
      }

      #tooltip-${uid}[data-popper-placement^='right'] > .arrow {
        left: -4px;
      }
        </style>

      `;

    tooltip.appendChild(arrow);
  }

  document.querySelector('html').appendChild(tooltip);
  const closeButton = document.querySelector(`#tooltip-${uid} button.close`);
  const nextButton = document.querySelector(`#tooltip-${uid} button.next`);
  const prevButton = document.querySelector(`#tooltip-${uid} button.prev`);
  closeButton.addEventListener('click', remove);
  nextButton.addEventListener('click', nextStep);
  prevButton.addEventListener('click', prevStep);

  return tooltip;
}

export default createTooltip;
