import { styleObjectToString } from "../utils";

const renderCloseXButton = (closeButton: any, stepType: 'modal' | 'tooltip'): string => {
  if (closeButton.disabled) return '';
  return `
    <style>
    .lusift .${stepType.toLowerCase()} .closeX{
      ${styleObjectToString(closeButton.styleProps)}
    }
    </style>

    <section class="close-btn">
    <button onclick="Lusift.close()" class="closeX close">
      &#10799;
    </button>
    </section>
  `;
};

export default renderCloseXButton;
