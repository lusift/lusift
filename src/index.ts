import { window, document } from 'global';
import Lusift from './Lusift';

// Look through lusift architecture docs

/* =============== TODOs =====================================================

  - TODO wrap an error handler around the package to safely throw errors
  - TODO Look into abstract syntax tree for html elements
  - TODO add progress bar

  ============================================================================
*/

if (typeof window !== "undefined") {
  window.Lusift = Lusift;
}

console.log('%c index file runs ', 'background: #222; color: #bada55');

export { Lusift as default };
