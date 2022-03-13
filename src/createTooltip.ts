 import { document, window } from 'global';

const createTooltip = ({ title, remove, nextStep, prevStep }) => {

  const tooltip = document.createElement('div');
  tooltip.id=`tooltip`;
  tooltip.role='tooltip';

  tooltip.innerHTML=`
        <style>
        #tooltip {
            background: #ccc;
            font-weight: bold;
            padding: 4px 8px;
            font-size: 13px;
            border-radius: 4px;
            display: block;
            z-index: 9999;
          }
        </style>
        <h3 style="font-weight: bold;">${title}</h3>
        <p style="font-weight: normal;">This is tooltip content</p>
        <div style="display: flex">
          <button class="close" style="border: 1px solid black; background: #888;">Close</button>
          <button class="prev" style="border: 1px solid black; background: #888;">Prev</button>
          <button class="next" style="border: 1px solid black; background: #888;">Next</button>
        </div>
    `;

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

      #tooltip[data-popper-placement^='top'] > .arrow {
        bottom: -4px;
      }

      #tooltip[data-popper-placement^='bottom'] > .arrow {
        top: -4px;
      }

      #tooltip[data-popper-placement^='left'] > .arrow {
        right: -4px;
      }

      #tooltip[data-popper-placement^='right'] > .arrow {
        left: -4px;
      }
        </style>
      `;

  tooltip.appendChild(arrow);

  document.querySelector('html').appendChild(tooltip);
  const closeButton = document.querySelector(`#tooltip button.close`);
  const nextButton = document.querySelector(`#tooltip button.next`);
  const prevButton = document.querySelector(`#tooltip button.prev`);
  closeButton.addEventListener('click', remove);
  nextButton.addEventListener('click', nextStep);
  prevButton.addEventListener('click', prevStep);

  return tooltip;
}

export default createTooltip;
