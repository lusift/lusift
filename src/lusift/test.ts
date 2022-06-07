import { InputContent, MinTooltip } from './types';

// TODO:Test around
const contentEx: InputContent = {
  'guidex': {
    data: {
      id: 'guidex',
      steps: [
        {
          index: 0,
          type: 'tooltip',
          data: {
            bodyContent: ''
          },
          target: {
            path: {
              value: '/tooltip-1'
            },
            elementSelector: '#tooltip-target'
          },
        },
        {
          index: 1,
          type: 'modal',
          data: {
            bodyContent: ''
          },
          target: {
            path: {
              value: '/tooltip-1',
              comparator: 'contains'
            },
            elementSelector: '#tooltip-target'
          },
        },
        {
          index: 1,
          type: 'hotspot',
          target: {
            path: {
              value: '/tooltip-1',
              comparator: 'is'
            },
            elementSelector: '#tooltip-target'
          },
          beacon: {
            placement: {
              top: 0,
              left: 0,
            }
          }
        },
      ]
    }
  }
}

const tooltipExample: MinTooltip = {
    index: 0,
    type: 'tooltip',
    data: {
        bodyContent: ''
    },
    target: {
        path: {
            value: '',
        },
        elementSelector: '',
    },
}
