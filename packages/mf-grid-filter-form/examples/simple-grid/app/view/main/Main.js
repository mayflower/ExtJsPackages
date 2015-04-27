/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 */
Ext.define('SimpleGrid.view.main.Main', {
    extend: 'Ext.container.Container',
    requires: [
        'Mayflower.grid.feature.FilterForm',
        'SimpleGrid.view.main.MainController',
        'SimpleGrid.view.main.MainModel'
    ],

    xtype: 'app-main',
    
    controller: 'main',
    viewModel: {
        type: 'main'
    },

    layout: {
        type: 'border'
    },

    items: [{
        xtype: 'panel',
        bind: {
            title: '{name}'
        },
        region: 'west',
        html: 'Grid filter form demo',
        width: 250,
        split: true
    },{
        region: 'center',
        xtype: 'tabpanel',
        items:[{
            title: 'Grid with filter from',
            items: [{
                xtype: 'grid',
                layout: 'fit',
                features: [Ext.create('Mayflower.grid.feature.FilterForm')],
                store: {
                    fields: [{name: 'id', type: 'int'}, 'name', 'description'],
                    proxy: {
                        type: 'memory',
                        enablePaging: true,
                        reader: {
                            type: 'array'
                        }
                    },
                    data: [
                        [1, 'One', 'First item'],
                        [2, 'Two', 'Second item'],
                        [3, 'Three', 'Third item'],
                        [4, 'Four', 'Fourth item'],
                        [5, 'Five', 'Fifth item'],
                        [6, 'Six', 'Sixth item'],
                        [7, 'Seven', 'Seventh item'],
                        [8, 'Eight', 'Eight item'],
                        [9, 'Nine', 'Ninth item'],
                        [10, 'Ten', 'Tenth item'],
                        [11, 'Eleven', 'Eleventh item'],
                        [12, 'Twelve', 'Twelfth item'],
                        [13, 'Thirteen', 'Thirteenth item'],
                        [14, 'Fourteen', 'Fourteenth item'],
                        [15, 'Fifteen', 'Fifteenth item'],
                        [16, 'Sixteen', 'Sixteenth item']
                    ]
                },
                columns: [{
                    text: 'Name',
                    dataIndex: 'name',
                    flex: 1,
                    filter: {
                        type: 'string',
                        value: 'T'
                    },
                    filterOption: {}
                }]
            }]
        }]
    }]
});
