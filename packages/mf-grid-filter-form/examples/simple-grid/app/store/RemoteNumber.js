/**
 * Number store
 */
Ext.define('SimpleGrid.store.RemoteNumber', {
    extend: 'Ext.data.Store',
    alias: 'store.remotenumber',
    remoteSort: true,
    remoteFilter: true,
    autoLoad: true,
    pageSize: 3,

    fields: [{name: 'id', type: 'int'}, 'name', 'description'],
    proxy: {
        type: 'ajax',
        url: 'remotenumber.php',
        reader: {
            type: 'json',
            rootProperty: 'numbers',
            totalProperty: 'totalCount'
        }
    }
});
