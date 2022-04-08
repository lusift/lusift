const tooltip1 = {
    index: 0,
    type: 'tooltip',
    target: {
        path: {
            value: '/lusift/dashboard',
            comparator: 'is'
        },
        elementSelector: 'svg'
    },
    data: {
        placement: 'bottom',
        arrow: true,
        bodyContent: '<p style="color:blue">Tooltip 1 body</p>',
    },
    actions: {
        styleProps: {},
        closeButton: {
            styleProps: {},
            disable: false,
        },
        navSection: {
            styleProps: {},
            nextButton: {
                text: 'next',
                styleProps: {},
                disable: false,
            },
            prevButton: {
                text: 'prev',
                styleProps: {},
                disable: false,
            },
            dismissLink: {
                text: 'skip this',
                styleProps: {},
                disable: false,
            }
        },
    }
}

const guide1 = {
    id: 'guide1',
    name: '',
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
                placement: 'right',
                arrow: true,
            },
        },
        {
            index: 2,
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
        }
    ]
}

export default guide1;
