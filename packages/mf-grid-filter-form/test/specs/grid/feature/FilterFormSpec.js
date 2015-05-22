describe('Mayflower grid filter form test suite', function () {
    var arrayStore, columns;

    Ext.require('Mayflower.grid.feature.FilterForm');

    arrayStore = Ext.create('Ext.data.ArrayStore', {
        fields: [{name: 'id', type: 'int'}, 'name', 'description'],
        data: [
            [1, 'One', 'First item'],
            [2, 'Two', 'Second item']
        ]
    });

    columns = [{
        text: 'Id',
        dataIndex: 'id',
        filterOption: {}
    }, {
        text: 'Name',
        dataIndex: 'name',
        filterOption: {}
    }, {
        text: 'Description',
        dataIndex: 'description'
    }];

    describe('Test the filtered grid', function () {
        var testWindow, grid, feature;

        feature = Ext.create('Mayflower.grid.feature.FilterForm');

        beforeEach(function (done) {
            grid = Ext.create('Ext.grid.Panel', {
                features: [feature],
                store: arrayStore,
                columns: columns
            });

            Ext.onReady(function () {
                testWindow = Ext.create('Ext.window.Window', {
                    items: [grid],
                    listeners: {
                        afterrender: function () {
                            done();
                        }
                    }
                }).show();
            });
        });

        afterEach(function () {
            Ext.destroy(grid);
            Ext.destroy(testWindow);
        });

        it('should have a grid with feature and dock', function () {
            expect(feature).toBeDefined();
            expect(feature.alias).toEqual(['feature.filterform']);
            expect(grid).toBeDefined();
            expect(grid.getDockedItems().length).toEqual(2);
        });

        it('should have a default grid filter form', function () {
            var filterForm = grid.getDockedItems()[1];
            expect(filterForm.xtype).toEqual('form');
            expect(filterForm.items.length).toEqual(2);

            expect(filterForm.items.getAt(0).xtype).toEqual('textfield');
            expect(filterForm.items.getAt(0).getFieldLabel()).toEqual('Id');

            expect(filterForm.items.getAt(1).xtype).toEqual('textfield');
            expect(filterForm.items.getAt(1).getFieldLabel()).toEqual('Name');

            expect(filterForm.getDockedItems().length).toEqual(1);
            expect(filterForm.getDockedItems()[0].xtype).toEqual('toolbar');
            expect(filterForm.getDockedItems()[0].items.getAt(1).isHidden()).toBeFalsy();

            expect(arrayStore.getCount()).toEqual(2);
            expect(arrayStore.getAt(0).get('name')).toEqual('One');
            expect(arrayStore.getAt(1).get('name')).toEqual('Two');
        });

        it('should filter the grid depending on the form data', function () {
            var filterForm = grid.getDockedItems()[1];

            filterForm.getDockedItems()[0].items.getAt(0).handler();
            expect(arrayStore.getCount()).toEqual(2);

            filterForm.items.getAt(1).setValue('On');
            filterForm.getDockedItems()[0].items.getAt(0).handler();
            expect(arrayStore.getCount()).toEqual(1);
        });

        it('should filter the grid depending on the form data', function () {
            var filterForm = grid.getDockedItems()[1];

            filterForm.items.getAt(1).setValue('One');
            filterForm.items.getAt(0).setValue('Two');
            filterForm.getDockedItems()[0].items.getAt(0).handler();
            expect(arrayStore.getCount()).toEqual(0);
        });

        it('should have a working reset button', function () {
            var filterForm = grid.getDockedItems()[1];

            filterForm.items.getAt(0).setValue('33');
            filterForm.items.getAt(1).setValue('Two');

            filterForm.getDockedItems()[0].items.getAt(1).handler();
            expect(filterForm.items.getAt(0).getValue()).toEqual('');
            expect(filterForm.items.getAt(1).getValue()).toEqual('');
            filterForm.getDockedItems()[0].items.getAt(0).handler();
            expect(arrayStore.getCount()).toEqual(2);
        });
    });

    describe('Test the filtered grid with hidden reset button', function () {
        var testWindow, grid, feature;

        feature = Ext.create('Mayflower.grid.feature.FilterForm', {hiddenResetButton: true});

        beforeEach(function (done) {
            grid = Ext.create('Ext.grid.Panel', {
                features: [feature],
                store: arrayStore,
                columns: columns
            });

            Ext.onReady(function () {
                testWindow = Ext.create('Ext.window.Window', {
                    items: [grid],
                    listeners: {
                        afterrender: function () {
                            done();
                        }
                    }
                }).show();
            });
        });

        afterEach(function () {
            Ext.destroy(grid);
            Ext.destroy(testWindow);
        });

        it('should have a grid with feature and dock', function () {
            expect(feature).toBeDefined();
            expect(feature.alias).toEqual(['feature.filterform']);
            expect(grid).toBeDefined();
            expect(grid.getDockedItems().length).toEqual(2);
        });

        it('should have a grid filter form with hidden reset button', function () {
            var filterForm = grid.getDockedItems()[1];
            expect(filterForm.xtype).toEqual('form');
            expect(filterForm.items.length).toEqual(2);

            expect(filterForm.items.getAt(0).xtype).toEqual('textfield');
            expect(filterForm.items.getAt(0).getFieldLabel()).toEqual('Id');

            expect(filterForm.items.getAt(1).xtype).toEqual('textfield');
            expect(filterForm.items.getAt(1).getFieldLabel()).toEqual('Name');

            expect(filterForm.getDockedItems().length).toEqual(1);
            expect(filterForm.getDockedItems()[0].xtype).toEqual('toolbar');
            expect(filterForm.getDockedItems()[0].items.getAt(1).isHidden()).toBeTruthy();

            expect(arrayStore.getCount()).toEqual(2);
            expect(arrayStore.getAt(0).get('name')).toEqual('One');
            expect(arrayStore.getAt(1).get('name')).toEqual('Two');
        });
    });

});
