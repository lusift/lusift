/* import { popperGenerator, defaultModifiers } from '@popperjs/core/lib/popper-lite';
import flip from '@popperjs/core/lib/modifiers/flip';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import popperOffsets from '@popperjs/core/lib/modifiers/popperOffsets';

const placement = 'auto';

// TODO finish this

const createPopper = popperGenerator({
  defaultOptions: {
    placement: placement,
  },
  defaultModifiers: [
    ...defaultModifiers,
    {
      name: 'offset',
      options: {
        offset: [0, 10],
      },
      enabled: true,
      phase: 'main',
      fn: ({ state }): void => null
    },
    {
      name: 'flip',
      enabled: placement==='auto',
      phase: 'main',
      fn: ({ state }): void => null
    }
  ]
});

export default createPopper; */

export default {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 10],
      },
    },
    {
      name: 'preventOverflow',
      enabled: false
    },
  ],
}

