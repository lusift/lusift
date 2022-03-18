import { document, window } from 'global';

export default () => {
  if (typeof window !== "undefined") {
    window.setTimeout(() => {

      // structure of tippy element:
      // https://atomiks.github.io/tippyjs/v6/themes/#tippy-elements

      // default, theme, border
      const tippyCSS =`
        .tippy-box[data-animation=fade][data-state=hidden]{opacity:0}[data-tippy-root]{max-width:calc(100vw - 10px)}.tippy-box{position:relative;background-color:#333;color:#fff;border-radius:4px;font-size:14px;line-height:1.4;outline:0;transition-property:transform,visibility,opacity}.tippy-box[data-placement^=top]>.tippy-arrow{bottom:0}.tippy-box[data-placement^=top]>.tippy-arrow:before{bottom:-7px;left:0;border-width:8px 8px 0;border-top-color:initial;transform-origin:center top}.tippy-box[data-placement^=bottom]>.tippy-arrow{top:0}.tippy-box[data-placement^=bottom]>.tippy-arrow:before{top:-7px;left:0;border-width:0 8px 8px;border-bottom-color:initial;transform-origin:center bottom}.tippy-box[data-placement^=left]>.tippy-arrow{right:0}.tippy-box[data-placement^=left]>.tippy-arrow:before{border-width:8px 0 8px 8px;border-left-color:initial;right:-7px;transform-origin:center left}.tippy-box[data-placement^=right]>.tippy-arrow{left:0}.tippy-box[data-placement^=right]>.tippy-arrow:before{left:-7px;border-width:8px 8px 8px 0;border-right-color:initial;transform-origin:center right}.tippy-box[data-inertia][data-state=visible]{transition-timing-function:cubic-bezier(.54,1.5,.38,1.11)}.tippy-arrow{width:16px;height:16px;color:#333}.tippy-arrow:before{content:"";position:absolute;border-color:transparent;border-style:solid}.tippy-content{position:relative;padding:5px 9px;z-index:1}

      .tippy-box[data-theme~=light]{color:#26323d;
        /*
          box-shadow:0 0 20px 4px rgba(154,161,177,.15),0 4px 80px -8px rgba(36,40,47,.25),0 4px 4px -2px rgba(91,94,105,.15);
        */
        background-color:#fff
      }
      .tippy-box[data-theme~=light][data-placement^=top]>.tippy-arrow:before{border-top-color:#fff}.tippy-box[data-theme~=light][data-placement^=bottom]>.tippy-arrow:before{border-bottom-color:#fff}.tippy-box[data-theme~=light][data-placement^=left]>.tippy-arrow:before{border-left-color:#fff}.tippy-box[data-theme~=light][data-placement^=right]>.tippy-arrow:before{border-right-color:#fff}.tippy-box[data-theme~=light]>.tippy-backdrop{background-color:#fff}.tippy-box[data-theme~=light]>.tippy-svg-arrow{fill:#fff}

      .tippy-box{border:1px transparent}.tippy-box[data-placement^=top]>.tippy-arrow:after{border-top-color:inherit;border-width:8px 8px 0;bottom:-8px;left:0}.tippy-box[data-placement^=bottom]>.tippy-arrow:after{border-bottom-color:inherit;border-width:0 8px 8px;top:-8px;left:0}.tippy-box[data-placement^=left]>.tippy-arrow:after{border-left-color:inherit;border-width:8px 0 8px 8px;right:-8px;top:0}.tippy-box[data-placement^=right]>.tippy-arrow:after{border-width:8px 8px 8px 0;left:-8px;top:0;border-right-color:inherit}.tippy-box[data-placement^=top]>.tippy-svg-arrow>svg:first-child:not(:last-child){top:17px}.tippy-box[data-placement^=bottom]>.tippy-svg-arrow>svg:first-child:not(:last-child){bottom:17px}.tippy-box[data-placement^=left]>.tippy-svg-arrow>svg:first-child:not(:last-child){left:12px}.tippy-box[data-placement^=right]>.tippy-svg-arrow>svg:first-child:not(:last-child){right:12px}.tippy-arrow{border-color:inherit}.tippy-arrow:after{content:"";z-index:-1;position:absolute;border-color:transparent;border-style:solid}

      .tippy-box{
        border: 1px solid red;
      }
      `;
      const styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = tippyCSS;
      document.head.appendChild(styleSheet);

    }, 0);
  }
}
