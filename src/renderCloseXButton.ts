import { styleObjectToString } from './utils';

const renderCloseXButton = (closeButton: any, stepType: string): string => {
  if (closeButton.disabled) return;
  return `
    <style>
      .lusift .${stepType.toLowerCase()} .closeX{
        ${styleObjectToString(closeButton.styleProps)}
      }
    </style>

    <section class="close-btn">
      <button onclick="Lusift.close()" class="closeX close">&times;</button>
    </section>
  `;
}

export default renderCloseXButton;
