const guide1 = {
    id: 'guide1',
    name: '',
    description: '',
    steps: [
        {
            index: 0,
            type: 'tooltip',
            targetElementSelector: 'svg',
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
            targetElementSelector: 'button',
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
    ]
}

export default guide1;
