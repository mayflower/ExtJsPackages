/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('simpleGrid.view.main.Main', {
    extend: 'Ext.container.Container',
    xtype: 'app-main',

    layout: {
        type: 'fit'
    },

    store: Ext.create('Ext.data.Store', {
        storeId:'employeeStore',
        fields:['name', 'seniority', 'department'],
        data: {'employees':[
            { "name": "Michael Scott",  "seniority": 7, "department": "Management" },
            { "name": "Dwight Schrute", "seniority": 2, "department": "Sales" },
            { "name": "Jim Halpert",    "seniority": 3, "department": "Sales" },
            { "name": "Kevin Malone",   "seniority": 4, "department": "Accounting" },
            { "name": "Angela Martin",  "seniority": 5, "department": "Accounting" }
        ]},
        proxy: {
            type: 'memory',
            reader: {
                type: 'json',
                rootProperty: 'employees'
            }
        }
    }),

    items: [{
        xtype: 'grid',
        title: 'Employees',
        store: Ext.data.StoreManager.lookup('employeeStore'),
        columns: [
            { text: 'Name',     dataIndex: 'name' },
            { text: 'Seniority', dataIndex: 'seniority' },
            { text: 'Department', dataIndex: 'department' }
        ],
        features: [{ftype:'celltooltip'}],
        width: 200,
        height: 275,
        renderTo: Ext.getBody()
    }]
});
