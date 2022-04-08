
const tooltip1Actions = {
  styleProps: {},
  closeButton: {
    styleProps: {},
    disabled: false,
  },
  navSection: {
    styleProps: {},
    nextButton: {
      text: 'next',
      styleProps: {
        border: '2px solid gold',
        borderColor: 'pink'
      },
      disabled: false,
    },
    prevButton: {
      text: 'prev',
      styleProps: {},
      disabled: true,
    },
    dismissLink: {
      text: 'skip this',
      styleProps: {},
      disabled: true,
    }
  },
}

const backdrop = {
  disabled: false,
  color: '#444',
  opacity: '0.5',
  stageGap: 5,
  nextOnOverlayClick: true
}

const div = document.createElement('div');
div.innerHTML = `
      <p style="color:blue">Tooltip 1 body</p>
`;

const tooltip1 = {
  index: 0,
  type: 'tooltip',
  target: {
    path: {
      value: '/lusift/dashboard',
      comparator: 'is'
    },
    elementSelector: '.lusift-logo'
  },
  data: {
    placement: 'bottom',
    arrow: true,
    backdrop,
    bodyContent: `
    <div>
      <p style="color:blue">Tooltip 1 body</p>
    </div>`,
  },
  actions: tooltip1Actions,
  styleProps: {
    border: '2px solid green',
  }
}


const hotspot1 = {
  index: 5,
  type: 'hotspot',
  target: {
    path: {
      value: '/lusift/nps',
      comparator: 'is'
    },
    elementSelector: 'h2',
  },
  beacon: {
    placement: {
      top: 90,
      left: 90,
    },
    size: 1,
    color: '',
    type: 'pulsing'
  },
  tip: {
    data: {
      placement: 'bottom',
      arrow: true,
      bodyContent: '<p style="color:blue">Hotspot 1 body</p>',
    },
    styleProps: {
      border: '2px solid green',
    }
  },
  async: true
}

const hotspot2 = {
  ...hotspot1,
  index: 6,
  target: {
    path: hotspot1.target.path,
    elementSelector: 'p',
  },
  tip: {
    ...hotspot1.tip,
    data: {
      ...hotspot1.tip.data,
      bodyContent: '<div><p style="color:blue">Hotspot 2 body</p></div>',
    }
  }
}

const guide1 = {
  id: 'guide1',
  name: 'first guide',
  description: '',
  steps: [
    tooltip1,
    {
      index: 1,
      type: 'tooltip',
      target: {
        path: {
          value: '/lusift/guides',
          comparator: 'contains'
        },
        elementSelector: 'input'
      },
      data: {
        placement: 'right-end',
        arrow: true,
        backdrop,
        bodyContent: `
        <div>
          <p style="color:blue">Tooltip 2 body</p>
          <button onclick="window.Lusift.next()">next</button>
          <button onclick="window.Lusift.prev()">prev</button>
        </div>`,
      },
    },
    {
      index: 2,
      type: 'tooltip',
      target: {
        path: {
          value: '/lusift/guides',
          comparator: 'contains'
        },
        elementSelector: 'h2'
      },
      data: {
        placement: 'bottom',
        arrow: true,
      },
    },
    {
      index: 3,
      type: 'tooltip',
      target: {
        path: {
          value: '/login',
          comparator: 'contains'
        },
        elementSelector: 'form'
      },
      data: {
        placement: 'right',
        arrow: true,
      },
    },
    {
      index: 4,
      type: 'tooltip',
      target: {
        path: {
          value: '/login',
          comparator: 'contains'
        },
        elementSelector: 'input'
      },
      data: {
        placement: 'right',
        arrow: true,
      },
    },
    hotspot1,
    hotspot2,
    {
      index: 7,
      type: 'tooltip',
      target: {
        path: {
          value: '/register',
          comparator: 'contains'
        },
        elementSelector: 'svg'
      },
      data: {
        placement: 'right',
        arrow: true,
      },
    },
    {
      index: 8,
      type: 'tooltip',
      target: {
        path: {
          value: '/lusift/checklists/2/ed',
          comparator: 'contains'
        },
        elementSelector: '.chakra-modal__content header'
      },
      data: {
        placement: 'right',
        arrow: true,
      },
    },
    {
      index: 9,
      type: 'modal',
      target: {
        path: {
          value: '/lusift/segments',
          comparator: 'contains'
        }
      },
      closeButton: {
        styleProps: {},
        disabled: true,
      },
      data: {
        bodyContent: `<h2>Hiii!</h2>`
      }
    }
  ],
  onNext: () => {
    window.alert('on next hook')
  },
  ondid: 'rg;oj'
}

const content = {
  "guide1": {
    type: 'guide',
    data: guide1
  }
}
console.log(content)

export default content;
