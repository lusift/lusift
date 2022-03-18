import { window, document } from 'global';
import Lusift from './Lusift';
import useStep from './useStep';

// Look through lusift architecture docs

/* =============== TODOs =====================================================

  - TODO wrap an error handler around the package to safely throw errors
  - TODO Look into abstract syntax tree for html elements
  - TODO see how steps for tooltip should progress
  - TODO inspect tooltip from demo.html
  - TODO add configurability to tooltipElement- content, styling, javascript methods
  - TODO add backdrop
  - TODO add progress bar

  ============================================================================
*/

// TODO see why global variables are undefined here but not on other place

/* if (typeof window !== "undefined") {
  // Client-side-only code
} */

// let lusiftInstance = new Lusift();

/* setTimeout(() => {
  window.Lusift = lusiftInstance;
}, 0); */

export { Lusift as default, useStep };
