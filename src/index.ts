import { window, document } from 'global';
import Lusift from './Lusift';

/* =============== TODOs =====================================================

  - TODO wrap an error handler around the package to safely throw errors without crashing entire website

  ============================================================================
*/

if (typeof window !== "undefined") {
  window.Lusift = Lusift;
}

console.log('%c index file runs ', 'background: #222; color: #bada55');

export { Lusift as default };
