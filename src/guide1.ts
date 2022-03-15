const guide1 = {
    id: 'guide1',
    name: '',
    description: '',
    steps: [
        {
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
                title: 'This is tooltip 1',
                arrow: true,
            },
            placement: 'bottom'
        },
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
                title: 'Tooltip 2',
                arrow: false,
            },
            placement: 'right'
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
                title: 'This is modal header',
                arrow: true,
            },
            placement: 'right'
        },
    ]
}

export default guide1;
