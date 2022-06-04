const vanillaRender = (elementToRender: string | Element, targetPath: string, callback?: Function) => {
    const target = document.querySelector(targetPath)!;
    if (elementToRender instanceof Element) {
        target.appendChild(elementToRender);
    } else {
        target.innerHTML = elementToRender;
    }
    if (callback) callback();
};

export default vanillaRender;
