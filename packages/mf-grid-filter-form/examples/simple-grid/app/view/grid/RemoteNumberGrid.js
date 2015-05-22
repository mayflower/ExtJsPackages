/**
 *
 */
Ext.define('SimpleGrid.view.grid.RemoteNumberGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'remotenumbergrid',

    requires: ['SimpleGrid.store.RemoteNumber'],

    columns: [{
        text: 'Id',
        dataIndex: 'id',
        flex: 1,
        filterOption: {}
    }, {
        text: 'Name',
        dataIndex: 'name',
        flex: 1,
        filterOption: {}
    }, {
        text: 'Description',
        dataIndex: 'description',
        flex: 1,
        filterOption: {}
    }],

    //private
    initComponent: function () {
        var store = Ext.create('SimpleGrid.store.RemoteNumber');

        Ext.apply(this, {
            features: [Ext.create('Mayflower.grid.feature.FilterForm')],
            store: store,
            bbar: [{xtype: 'pagingtoolbar', store: store}]
        });

        this.callParent(arguments);
    }
});
