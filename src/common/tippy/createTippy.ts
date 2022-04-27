import tippy, {
  inlinePositioning,
  Instance as TippyInstance
} from 'tippy.js';
import popperOptions from './popperOptions';

const createTippy = ({
  target,
  remove,
  content,
  arrow,
  offset,
  placement
}): any => {

  if(!remove){
    remove = () => {};
  }

  return tippy(target, {
    allowHTML: true,
    interactive: true,
    zIndex: 99999,
    hideOnClick: false,
    inlinePositioning: true,
    moveTransition: 'transform 0.2s ease-out',
    onClickOutside(instance, event) {
      remove();
    },
    content,
    arrow,
    offset,
    placement,
    plugins: [inlinePositioning],
    popperOptions: {
      ...popperOptions,
      placement,
      modifiers: [
        ...popperOptions.modifiers,
        {
          name: 'flip',
          enabled: placement === 'auto',
        },
        {
          name: 'arrow',
          enabled: arrow
        }
      ]
    },
    showOnCreate: true,
    trigger: 'manual',
    theme: 'light'
  });
}

export default createTippy;
