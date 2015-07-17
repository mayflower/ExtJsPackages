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
        filterOption: {
            operator: '<='
        }
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
            expect(filterForm.items.getAt(0).operator).toEqual('<=');


            expect(filterForm.items.getAt(1).xtype).toEqual('textfield');
            expect(filterForm.items.getAt(1).getFieldLabel()).toEqual('Name');
            expect(filterForm.items.getAt(1).operator).toEqual('like');

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

    describe('Test checking for FormPosition FilterOption', function () {
        var feature;

        beforeEach(function () {
            feature = Ext.create('Mayflower.grid.feature.FilterForm', {hiddenResetButton: true});
        });

        afterEach(function () {
            Ext.destroy(feature);
        });

        it ('should return true if "formPosition" is defined', function () {
            expect(feature.hasFormPositionFilterOption([{
                formPosition: 77
            }])).toBe(true);
        });

        it ('should return false if "formPosition" is not defined', function () {
            var testCases = [
                [],
                [{}],
                [{}, {}],
                [{foo: 'foo'}, {foo: 'foo', bar: 'bar'}]
            ];

            Ext.Array.each(testCases, function (filterOptions) {
                expect(feature.hasFormPositionFilterOption(filterOptions)).toBe(false);
            });
        });

        it('should return an unmodified array of columns when "formPosition" is not defined', function () {
            expect(feature.getColumnsSortedByFormPosition(columns)).toBe(columns);
        });

        it('should return an array of columns sorted by "formPosition"', function () {
            var testCases = [{
                filterItems: [{
                    fieldLabel: 'id',
                    name: 'Id',
                    formPosition: 2
                }, {
                    fieldLabel: 'name',
                    name: 'Name',
                    formPosition: 0
                }, {
                    fieldLabel: 'description',
                    name: 'Description',
                    formPosition: 1
                }],
                sortedItems: [{
                    fieldLabel: 'name',
                    name: 'Name',
                    formPosition: 0
                }, {
                    fieldLabel: 'description',
                    name: 'Description',
                    formPosition: 1
                }, {
                    fieldLabel: 'id',
                    name: 'Id',
                    formPosition: 2
                }]
            }, {
                filterItems: [{
                    fieldLabel: 'id',
                    name: 'Id'
                }, {
                    fieldLabel: 'name',
                    name: 'Name',
                    formPosition: 1
                }, {
                    fieldLabel: 'description',
                    name: 'Description',
                    formPosition: 0
                }],
                sortedItems: [{
                    fieldLabel: 'description',
                    name: 'Description',
                    formPosition: 0
                }, {
                    fieldLabel: 'name',
                    name: 'Name',
                    formPosition: 1
                }, {
                    fieldLabel: 'id',
                    name: 'Id'
                }]
            }, {
                filterItems: [{
                    fieldLabel: 'id',
                    name: 'Id',
                    lala: {}
                }, {
                    fieldLabel: 'name',
                    name: 'Name',
                    formPosition: 0
                }, {
                    fieldLabel: 'description',
                    name: 'Description',
                    formPosition: 1
                }],
                sortedItems: [{
                    fieldLabel: 'name',
                    name: 'Name',
                    formPosition: 0
                }, {
                    fieldLabel: 'description',
                    name: 'Description',
                    formPosition: 1
                }, {
                    fieldLabel: 'id',
                    name: 'Id',
                    lala: {}
                }]
            }, {
                filterItems: [{
                    fieldLabel: 'name',
                    name: 'Name',
                    formPosition: 0
                }, {
                    fieldLabel: 'description',
                    name: 'Description',
                    formPosition: 1
                }, {
                    fieldLabel: 'id',
                    name: 'Id',
                    lala: {}
                }],
                sortedItems: [{
                    fieldLabel: 'name',
                    name: 'Name',
                    formPosition: 0
                }, {
                    fieldLabel: 'description',
                    name: 'Description',
                    formPosition: 1
                }, {
                    fieldLabel: 'id',
                    name: 'Id',
                    lala: {}
                }]
            }];

            Ext.Array.each(testCases, function (data) {
                expect(feature.getColumnsSortedByFormPosition(data.filterItems)).toEqual(data.sortedItems);
            });
        });
    });

    describe('Test the filtered grid with custom order', function () {
        var testWindow, grid, feature, columns;

        columns = [{
            text: 'Id',
            dataIndex: 'id',
            filterOption: {}
        }, {
            text: 'Name',
            dataIndex: 'name',
            filterOption: {
                formPosition: 0
            }
        }, {
            text: 'Description',
            dataIndex: 'description',
            filterOption: {
                formPosition: 1
            }
        }];

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

        it('should have a grid filter form with hidden reset button', function () {
            var filterForm = grid.getDockedItems()[1];

            expect(filterForm.items.getAt(0).xtype).toEqual('textfield');
            expect(filterForm.items.getAt(0).getFieldLabel()).toEqual('Name');

            expect(filterForm.items.getAt(1).xtype).toEqual('textfield');
            expect(filterForm.items.getAt(1).getFieldLabel()).toEqual('Description');

            expect(filterForm.items.getAt(2).xtype).toEqual('textfield');
            expect(filterForm.items.getAt(2).getFieldLabel()).toEqual('Id');
        });
    });

    describe('Test the filtered grid with 2 column layout', function () {
        var testWindow, grid, feature, columns;

        columns = [{
            text: 'Id',
            dataIndex: 'id',
            filterOption: {}
        }, {
            text: 'Name',
            dataIndex: 'name',
            filterOption: {
                formPosition: 0
            }
        }, {
            text: 'Description',
            dataIndex: 'description',
            filterOption: {
                formPosition: 1
            }
        }];

        feature = Ext.create('Mayflower.grid.feature.FilterForm', {columns: 2});

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

        it('should have two items', function () {
            var form = grid.down('form');

            expect(form.items.length).toEqual(2);
            expect(form.items.getAt(0).items.length).toEqual(1);
            expect(form.items.getAt(1).items.length).toEqual(2);
        });
    });

    describe('Test the filtered grid with 3 column layout', function () {
        var testWindow, grid, feature, columns;

        columns = [{
            text: 'Id',
            dataIndex: 'id',
            filterOption: {}
        }, {
            text: 'Name',
            dataIndex: 'name',
            filterOption: {
                formPosition: 0
            }
        }, {
            text: 'Description',
            dataIndex: 'description',
            filterOption: {
                formPosition: 1
            }
        }];

        feature = Ext.create('Mayflower.grid.feature.FilterForm', {columns: 3});

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

        it('should have three items', function () {
            var form = grid.down('form');

            expect(form.items.length).toEqual(3);
            expect(form.items.getAt(0).items.length).toEqual(1);
            expect(form.items.getAt(1).items.length).toEqual(1);
            expect(form.items.getAt(2).items.length).toEqual(1);
        });
    });

    describe('Test the filtered grid with 4 column layout', function () {
        var testWindow, grid, feature, columns;

        arrayStore = Ext.create('Ext.data.ArrayStore', {
            fields: [
                {name: 'id', type: 'int'},
                'name',
                'description',
                'description 2',
                'description 3',
                'description 4',
                'description 5',
                'description 6',
                'description 7',
                'description 8'
            ],
            data: [
                [
                    1,
                    'One',
                    'First item',
                    'description 2',
                    'description 3',
                    'description 4',
                    'description 5',
                    'description 6',
                    'description 7',
                    'description 8'
                ],
                [
                    2,
                    'Two',
                    'Second item',
                    'description 2',
                    'description 3',
                    'description 4',
                    'description 5',
                    'description 6',
                    'description 7',
                    'description 8'
                ]
            ]
        });

        columns = [{
            text: 'Id',
            dataIndex: 'id',
            filterOption: {}
        }, {
            text: 'Name',
            dataIndex: 'name',
            filterOption: {
                formPosition: 0
            }
        }, {
            text: 'Description',
            dataIndex: 'description',
            filterOption: {
                formPosition: 1
            }
        }, {
            text: 'Description 2',
            dataIndex: 'description 2',
            filterOption: {
                formPosition: 2
            }
        }, {
            text: 'Description 3',
            dataIndex: 'description 3',
            filterOption: {
                formPosition: 3
            }
        }, {
            text: 'Description 4',
            dataIndex: 'description 4',
            filterOption: {
                formPosition: 4
            }
        }, {
            text: 'Description 5',
            dataIndex: 'description 5',
            filterOption: {
                formPosition: 5
            }
        }, {
            text: 'Description 6',
            dataIndex: 'description 6',
            filterOption: {
                formPosition: 6
            }
        }, {
            text: 'Description 7',
            dataIndex: 'description 7',
            filterOption: {
                formPosition: 7
            }
        }, {
            text: 'Description 8',
            dataIndex: 'description 8',
            filterOption: {
                formPosition: 8
            }
        }];

        feature = Ext.create('Mayflower.grid.feature.FilterForm', {columns: 4});

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

        it('should have four items', function () {
            var form = grid.down('form');

            expect(form.items.length).toEqual(4);
            expect(form.items.getAt(0).items.length).toEqual(2);
            expect(form.items.getAt(1).items.length).toEqual(2);
            expect(form.items.getAt(2).items.length).toEqual(2);
            expect(form.items.getAt(3).items.length).toEqual(4);
        });
    });

    describe('Test the filtered grid with 2 column layout and hiden fields', function () {
        var testWindow, grid, feature, columns;

        arrayStore = Ext.create('Ext.data.ArrayStore', {
            fields: [
                {name: 'id', type: 'int'},
                'name',
                'description',
                'description 2',
                'description 3',
                'description 4',
                'description 5',
                'description 6',
                'description 7',
                'description 8'
            ],
            data: [
                [
                    1,
                    'One',
                    'First item',
                    'description 2',
                    'description 3',
                    'description 4',
                    'description 5',
                    'description 6',
                    'description 7',
                    'description 8'
                ],
                [
                    2,
                    'Two',
                    'Second item',
                    'description 2',
                    'description 3',
                    'description 4',
                    'description 5',
                    'description 6',
                    'description 7',
                    'description 8'
                ]
            ]
        });

        columns = [{
            text: 'Id',
            dataIndex: 'id',
            filterOption: {}
        }, {
            text: 'Name',
            dataIndex: 'name',
            filterOption: {
                formPosition: 0,
                xtype: 'hiddenfield'
            }
        }, {
            text: 'Description',
            dataIndex: 'description',
            filterOption: {
                formPosition: 1,
                xtype: 'hiddenfield'
            }
        }, {
            text: 'Description 2',
            dataIndex: 'description 2',
            filterOption: {
                formPosition: 2
            }
        }, {
            text: 'Description 3',
            dataIndex: 'description 3',
            filterOption: {
                formPosition: 3
            }
        }, {
            text: 'Description 4',
            dataIndex: 'description 4',
            filterOption: {
                formPosition: 4
            }
        }, {
            text: 'Description 5',
            dataIndex: 'description 5',
            filterOption: {
                formPosition: 5
            }
        }, {
            text: 'Description 6',
            dataIndex: 'description 6',
            filterOption: {
                formPosition: 6
            }
        }, {
            text: 'Description 7',
            dataIndex: 'description 7',
            filterOption: {
                formPosition: 7,
                xtype: 'hiddenfield'
            }
        }, {
            text: 'Description 8',
            dataIndex: 'description 8',
            filterOption: {
                formPosition: 8
            }
        }];

        feature = Ext.create('Mayflower.grid.feature.FilterForm', {columns: 2});

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

        it('should have four items and hidden fields in last item', function () {
            var form = grid.down('form'),
                hiddenFieldsAt0,
                hiddenFieldsAt1;

            expect(form.items.length).toEqual(2);
            expect(form.items.getAt(0).items.length).toEqual(3);
            expect(form.items.getAt(1).items.length).toEqual(7);

            hiddenFieldsAt0 = form.items.getAt(0).items.filter('xtype', 'hiddenfield');
            hiddenFieldsAt1 = form.items.getAt(1).items.filter('xtype', 'hiddenfield');

            expect(hiddenFieldsAt0.getCount()).toEqual(0);
            expect(hiddenFieldsAt1.getCount()).toEqual(3);
        });
    });
});
