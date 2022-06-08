const hasFocussableElements = (root: Element): boolean => {
    let focusableEls = [].slice.call(root.querySelectorAll('[autofocus], [tabindex], a, input, textarea, select, button'));

    focusableEls = focusableEls.filter((el: HTMLElement) => {
        const isDisabledOrHidden = el.getAttribute('aria-disabled') === 'true' ||
            el.getAttribute('disabled') != null ||
            el.getAttribute('hidden') != null ||
            el.getAttribute('aria-hidden') === 'true';
        const isTabbableAndVisible = el.tabIndex >= 0 &&
            el.getBoundingClientRect().width > 0 &&
            !isDisabledOrHidden;
        let isProgrammaticallyHidden = false;
        if (isTabbableAndVisible) {
            const style = getComputedStyle(el);
            isProgrammaticallyHidden =
                style.display === 'none' || style.visibility === 'hidden';
        }
        return isTabbableAndVisible && !isProgrammaticallyHidden;
    });

    return focusableEls.length > 0;
};

export default hasFocussableElements;
