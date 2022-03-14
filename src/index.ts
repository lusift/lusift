import Lusift from './Lusift';
import guide1 from './guide1';

// Look through lusift architecture docs

/* =============== TODOs =====================================================

  - TODO see how steps for tooltip should progress
  - HACK add all methods for Guide
  - TODO add all lifecycle methods for Tooltip
  - TODO inspect tooltip from demo.html
  - TODO add configurability to tooltipElement- content, styling, javascript methods
  - TODO add backdrop
  - TODO add progress bar
  - TODO lay out a series of interactions and events that will occur as part of
         our first guide
  - TODO add event emmitors and listeners and handlers

  ============================================================================
*/


const content = {
    "guide1": {
        type: 'guide',
        data: guide1
    }
}

export default () => {
    console.log('Lusift imported');
    const lusiftInstance = new Lusift(content);
    lusiftInstance.showContent("guide1");
}
