import { document, window } from 'global';

export default () => {
  if (typeof window !== "undefined") {
    window.setTimeout(() => {

      // structure of tippy element:
      // https://atomiks.github.io/tippyjs/v6/themes/#tippy-elements

      const lusiftCSS =`
      /*default*/
      /*tooltip closeX*/

      .lusift .tooltip section.close-btn{
        display: flex;
        justify-content: flex-end;
        margin: -4px !important;
      }
      .lusift .tooltip .closeX{
        margin: -4px -5px !important;
        margin-bottom: 0 !important;
        font-weight: normal;
        font-size: 1rem;
        padding: 0 2px;
        color: #666;
      }


      /*tooltip nav-buttons*/
      .lusift .tooltip section.nav-buttons{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 4px !important;
      }
      .lusift .tooltip .nav-buttons .dismiss-link{
        color: #777;
        font-style: italic;
        font-size: 0.8rem;
        margin-right: 0.4rem;
      }
      .lusift .tooltip .nav-buttons .next, .nav-buttons .prev{
        color: #fff;
        background-color: rgb(17, 153, 158);
        padding: 0.2rem 0.35rem;
        font-size: 0.75rem;
        font-weight: bold;
        border-radius: 8px;
      }
      .lusift .tooltip .nav-buttons .prev{
        margin-right: 0.3rem;
      }

      /*tooltip main content*/

      .tippy-box{
        z-index: 999999;
      }
      .lusift .tooltip {
        font-weight: bold;
        font-size: 1rem;
        display: block;
        padding: 5px 9px;
        z-index: 99999;
      }
      .lusift .tooltip > * {
        margin: 3px 6px;
      }
      .lusift .tooltip .body-content{
        margin-top: 0 !important;
        min-width: 80px;
      }

      /*modal*/
      /*modal closeX*/


      .lusift .modal section.close-btn{
        display: flex;
        justify-content: flex-end;
      }
      .lusift .modal .closeX{
        /*
        border: 1px solid blue;
        */
        margin-bottom: 0 !important;
        font-weight: normal;
        font-size: 1.25rem;
        padding: 0 2px;
        margin-right: 0.2rem;
        color: #666;
      }

      /*modal body-content*/

      .lusift .modal .body-content{
        padding: 3px 15px;
        color: #111;
        background: #fff;
        flex-grow: 1;
      }

      .lusift-button{
        color: #fff;
        background-color: rgb(17, 153, 158);
        padding: 0.2rem 0.35rem;
        font-size: 0.75rem;
        font-weight: bold;
        border-radius: 8px;
      }

      /*tooltip-progress*/

      .lusift-progress {
        initial: none;
        margin: 0;
        padding: 0;
        display: block;
        width: 100%;
      }
      .lusift-progress {
        margin-top: -1px;
      }
      .modal .lusift-progress {
        margin-top: 0;
      }
      .lusift-progress::-webkit-progress-bar {
        initial: none;
        background-color: transparent; /*background-color of tooltip*/
      }
      .lusift-progress::-webkit-progress-value {
        initial: none;
      }
      `.replace(/(\r\n|\n|\r)/gm, "");

      const styleSheet = document.createElement("style");
      // TODO bundling - maybe put the string in a file and load it minimized with webpack?
      styleSheet.type = "text/css";
      styleSheet.setAttribute("lusift", "");
      // styleSheet.innerText = tippyCSS;
      styleSheet.textContent = lusiftCSS;
      document.head.appendChild(styleSheet);
    }, 0);
  }
}
