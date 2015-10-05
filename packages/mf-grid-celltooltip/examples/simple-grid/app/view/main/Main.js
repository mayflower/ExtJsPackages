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

    loremIpsumNote: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ' +
        'ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et' +
        'ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum ' +
        'dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore ' +
        'magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita' +
        'kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',

    initComponent: function () {
        Ext.create('Ext.data.Store', {
            storeId:'employeeStore',
            fields:['name', 'seniority', 'department', 'notes'],
            data: {'employees':[
                {name: 'Michael Scott', seniority: 7, department: 'Management', notes: this.loremIpsumNote},
                {name: 'Dwight Schrute', seniority: 2, department: 'Sales', notes: this.loremIpsumNote},
                {name: 'Jim Halpert', seniority: 3, department: 'Sales', notes: this.loremIpsumNote},
                {name: 'Kevin Malone', seniority: 4, department: 'Accounting', notes: this.loremIpsumNote},
                {name: 'Angela Martin', seniority: 5, department: 'Accounting', notes: this.loremIpsumNote}
            ]},
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: 'employees'
                }
            }
        });

        Ext.apply(this, {
            items: [{
                xtype: 'grid',
                title: 'Employees',
                store: Ext.data.StoreManager.lookup('employeeStore'),
                columns: [
                    {text: 'Name', dataIndex: 'name'},
                    {text: 'Seniority', dataIndex: 'seniority'},
                    {text: 'Department', dataIndex: 'department'},
                    {text: 'Notes', dataIndex: 'notes'}
                ],
                features: [{ftype:'celltooltip'}],
                width: 200,
                height: 275,
                renderTo: Ext.getBody()
            }]
        });

        this.callParent();
    }
});
