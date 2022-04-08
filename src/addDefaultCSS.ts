import { window, document } from 'global';
// const lusiftDefaultCSS = require('./style/lusift.css');

export default () => {
  if (typeof document ==='undefined') return;
  const lusiftDefault = document.createElement('style');
  lusiftDefault.type = 'text/css';
  lusiftDefault.setAttribute('lusift-default', '');
  document.head.appendChild(lusiftDefault);

  const tippyStyle = document.createElement('style');
  tippyStyle.type = 'text/css';
  tippyStyle.setAttribute('lusift-tippy', '');
  document.head.appendChild(tippyStyle);

  const lusiftCustom = document.createElement('style');
  lusiftCustom.type = 'text/css';
  lusiftCustom.setAttribute('lusift-custom', '');
  document.head.appendChild(lusiftCustom);

  // TODO host site is trying to pull from it's path
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = './style/lusift.css';
  document.head.appendChild(link);
}
