/**
 * Number store
 */
Ext.define('SimpleGrid.store.LocalNumber', {
    extend: 'Ext.data.ArrayStore',
    alias: 'store.localnumber',

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
});
