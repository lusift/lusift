
const guide1 = {
  id: 'tutorial',
  name: 'Tutorial',
  closeOnLastNext: false,
  steps: [
    {
      index: 0,
      type: 'tooltip',
      target: {
        elementSelector: '[data-lusift="button-1"]'
      },
      data: {
        placement: {
          position: 'right'
        },
        zIndex: 100,
        arrowSizeScale: 1.25,
        bodyContent: 'Step 1'
      }
    },
    {
      index: 1,
      type: 'tooltip',
      target: {
        elementSelector: '[data-lusift="button-2"]'
      },
      data: {
        placement: {
          position: 'left'
        },
        arrowSizeScale: 1.25,
        bodyContent: 'Step 2'
      }
    },
    {
      index: 2,
      type: 'tooltip',
      target: {
        elementSelector: '[data-lusift="button-3"]'
      },
      data: {
        placement: {
          position: 'top'
        },
        arrowSizeScale: 1.25,
        bodyContent: 'Step 3'
      }
    },
    {
      index: 3,
      type: 'tooltip',
      target: {
        elementSelector: '[data-lusift="button-4"]'
      },
      data: {
        placement: {
          position: 'right'
        },
        arrowSizeScale: 1.25,
        bodyContent: 'Step 4 (last)'
      }
    },
  ]
}

const content = {
  "tutorial": {
    type: 'guide',
    data: guide1
 }
}

export default content;
