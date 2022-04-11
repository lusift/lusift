import { document } from 'global';

//https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518

const htmlStringToElement = (htmlString: string): document.HTMLElement => {
    const template = document.createElement('template');
    htmlString = htmlString.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = htmlString;
    return template.content.firstChild;
}

function htmlStringToElements(html: string) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

export default htmlStringToElement;
