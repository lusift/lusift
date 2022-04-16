import { window, document } from 'global';
import Lusift from 'lusift';
import { Content } from '../src/common/types';
import { vanillaRender } from '../src/common/utils';


if (typeof window !== "undefined") {
  window.addEventListener('error', function(event) {
    console.log(event);
    return false;
  }, true);
  Lusift.render = vanillaRender;
  window.Lusift = Lusift;
}

console.log('%c index file runs ', 'background: #222; color: #bada55');

export { Lusift as default, Content as LusiftContent };
