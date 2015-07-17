/**
 * This {@link Ext.grid.feature.Feature grid feature} adds a {@link Ext.form.Panel form} to the grid with filter options
 * similar to {@link Ext.grid.filters.Filters}.
 *
 * The filter form is docked to the bottom of the {@link Ext.grid.Panel grid}.
 *
 * When this feature is enabled for a grid, each column having the property object `filterOption` set,
 * will be added to the filter form panel as a {@link Ext.form.field.Text text field} by default.
 *
 * The items in the form will appear in the same order as they are defined in the columns.
 * Custom ordering can be provided by using the `filterOption` property `formPosition`.
 *
 * There is also the `resettable` property (defaults to false), with which you can enable a reset button on the
 * chosen form field
 *
 *     filterOption: {
 *         formPosition: 1,
 *         resettable: true
 *     }
 */
Ext.define('Mayflower.grid.feature.FilterForm', {
    extend: 'Ext.grid.feature.Feature',
    requires: [
        'Mayflower.grid.feature.FilterFormController',
        'Ext.layout.container.Column'
    ],
    alias: 'feature.filterform',

    /**
     * @cfg {Boolean} hiddenResetButton
     * true to hide the filter form reset button.
     */
    hiddenResetButton: false,

    //<locale>
    /**
     * @cfg {String} showButtonText
     * Button text for the submit button in filter form.
     */
    showButtonText: 'Show',
    //</locale>
    //<locale>
    /**
     * @cfg {String} showButtonTooltipText
     * Tooltip text for the submit button in filter form.
     */
    showButtonTooltipText: '',
    //</locale>
    //<locale>
    /**
     * @cfg {String} resetButtonText
     * Button text for the reset button in filter form.
     */
    resetButtonText: 'Reset',
    //</locale>
    //<locale>
    /**
     * @cfg {String} resetButtonTooltipText
     * Tooltip text for the reset button in filter form.
     */
    resetButtonTooltipText: '',
    //</locale>
    //<locale>
    /**
     * @cfg {String} containerTitle
     * Title for the filter container
     */
    containerTitle: 'Filters',
    //</locale>

    form: undefined,

    /**
     * @cfg {Boolean} collapsible
     *
     * This makes the filter form collapsible
     */
    collapsible: false,

    /**
     * @cfg {Number} columns
     *
     * This provides a column layout if columns is greater than 1
     */
    columns: 1,

    //private
    init: function (grid) {
        var me = this,
            formConfig,
            columnWidth;

        me.callParent(arguments);

        formConfig = {
            xtype: 'form',
            controller: 'filterform',
            dock: 'bottom',
            itemId: 'grid-filter-form',
            border: false,
            region: 'south',
            defaults: {
                anchor: '90%',
                allowBlank: true,
                labelAlign: 'left',
                labelWidth: 100,
                msgTarget: 'side',
                resettable: false
            },
            dockedItems: me.createFilterFormToolbar()
        };

        if (me.collapsible === true) {
            Ext.apply(formConfig, {
                height: 250,
                collapseMode: 'header',
                collapsible: true,
                collapseDirection: 'bottom',
                collapsed: true,
                collapseFirst: true,
                border: true,
                scrollable: true,
                title: me.containerTitle,
                animCollapse: false
            });
        }

        if (me.columns > 1) {
            columnWidth = 1 / me.columns;
            Ext.apply(formConfig, {
                layout: 'column',
                defaults: {
                    style: 'display: inline-block; vertical-align: top;',
                    allowBlank: true,
                    labelAlign: 'left',
                    labelWidth: 100,
                    msgTarget: 'side',
                    defaultType: 'textfield',
                    anchor: '90%',
                    xtype: 'container',
                    layout: 'form',
                    columnWidth: columnWidth
                }
            });
        } else {
            Ext.apply(formConfig, {
                defaultType: 'textfield'
            });
        }

        me.form = Ext.create(formConfig);

        grid.on({
            beforerender: function (grid) {
                var columns = grid.getColumnManager().getColumns(),
                    filterItems = me.buildFilterOptionItems(columns);

                if (filterItems.length === 0) {
                    return;
                }

                if (me.hasFormPositionFilterOption(filterItems)) {
                    filterItems = me.getColumnsSortedByFormPosition(filterItems);
                }

                filterItems = me.addResetTriggerToFormField(filterItems);

                if (me.columns > 1) {
                    me.addColumnItems(filterItems);
                } else {
                    me.form.add(filterItems);
                }

                grid.insertDocked(0, me.form);
            }
        });
    },

    /**
     * Check on of the columns has the property "formPosition"
     *
     * @param {Ext.grid.column.Column[]} columns
     * @returns {boolean}
     *
     * @private
     */
    hasFormPositionFilterOption: function (columns) {
        var hasFormPosition = false;
        Ext.Array.each(columns, function (item) {
            var hasItemFormPosition = false;

            if (item.formPosition !== undefined) {
                hasItemFormPosition = true;
            }

            hasFormPosition = hasFormPosition || hasItemFormPosition;
        });

        return hasFormPosition;
    },

    /**
     * Add an reset button to a field
     *
     * @param {Ext.grid.column.Column[]} columns
     * @returns {boolean}
     *
     * @private
     */
    addResetTriggerToFormField: function (columns) {
        var me = this,
            trigger,
            columnObjects = [];

        Ext.Array.each(columns, function (column) {

            trigger = {};

            if (column.resettable === true) {
                trigger = {
                    triggers: {
                        resetButton: {
                            cls: 'filterform-trigger-revert',
                            handler: function () {
                                me.form.getController().onResetFilters(this.getName());
                            }
                        }
                    }
                };
            }
            columnObjects.push(Ext.Object.merge(column, trigger));
        });

        return columnObjects;
    },

    /**
     * Sort the columns by the "formPosition" property.
     *
     * @param {Ext.grid.column.Column[]} columns
     * @returns {Ext.grid.column.Column[]}
     *
     * @private
     */
    getColumnsSortedByFormPosition: function (columns) {
        return Ext.Array.sort(columns, function (a, b) {
            if (a.formPosition !== undefined && b.formPosition !== undefined) {
                return (a.formPosition < b.formPosition) ? -1 : 1;
            }

            if (a.formPosition === undefined) {
                return 1;
            }
            // b.formPosition is undefined
            return -1;
        });
    },

    /**
     * Creates the option filter items for the filter form.
     *
     * Filter columns with the property filterOption will have their
     * own filter form element.
     *
     * @param {Ext.grid.column.Column[]} columns
     * @returns {Object[]}
     *
     * @private
     */
    buildFilterOptionItems: function (columns) {
        var me = this,
            filterItems;

        filterItems = Ext.Array.filter(columns, function (item) {
            return item.filterOption !== undefined;
        });

        filterItems =  Ext.Array.map(filterItems, function (item) {
            var config = {};

            config = Ext.apply(config, item.filterOption, {
                fieldLabel: item.text,
                name: item.dataIndex,
                stateId: me.title + '-' + item.dataIndex,
                operator: 'like'
            });

            return config;
        });

        return filterItems;
    },

    /**
     * Create the Toolbar for the filter form.
     * This Toolbar has two buttons, 'Apply' and 'Reset'.
     * The visibility of the reset button is controlled
     * by {@link #hiddenResetButton}
     *
     * @returns {Ext.toolbar.Toolbar}
     *
     * @private
     */
    createFilterFormToolbar: function () {
        var me = this;

        return Ext.create({
            xtype: 'toolbar',
            dock: 'right',
            ui: 'footer',
            defaults: {minWidth: 100},
            items: [{
                xtype: 'button',
                text: me.showButtonText,
                tooltip: me.showButtonTooltipText,
                iconCls: 'filterform-btn-icon-apply',
                handler: function () {
                    me.form.getController().onApplyFilters(arguments);
                }
            }, {
                xtype: 'button',
                text: me.resetButtonText,
                tooltip: me.resetButtonTooltipText,
                hidden: me.hiddenResetButton,
                iconCls: 'filterform-btn-icon-revert',
                handler: function () {
                    me.form.getController().onResetFilters(arguments);
                }
            }]
        });
    },

    /**
     * Cuts filterItems into proper pieces and adds them as columns
     *
     * @param {Array} filterItems
     *
     * @private
     */
    addColumnItems: function (filterItems) {
        var me = this,
            formColumnItems,
            elements,
            columnElementsNumber,
            columnElements,
            hiddenFields,
            displayedFields;

        formColumnItems = [];
        displayedFields = me.getDisplayedFilterElements(filterItems);
        hiddenFields = me.getHiddenFilterElements(filterItems);
        elements = displayedFields.length;
        columnElementsNumber = parseInt(elements / me.columns, 10);
        columnElements = [];

        for (var field = 1; field <= displayedFields.length; field ++) {
            columnElements.push(displayedFields[field-1]);

            if (field % columnElementsNumber === 0 && formColumnItems.length < me.columns) {
                formColumnItems.push(columnElements);
                columnElements = [];
            }
        }

        if (columnElements.length > 0) {
            formColumnItems = me.addElementsToLastColumn(formColumnItems, columnElements);
        }

        if (hiddenFields.length > 0) {
            formColumnItems = me.addElementsToLastColumn(formColumnItems, hiddenFields);
        }

        for (var itemCounter = 0; itemCounter < formColumnItems.length; itemCounter++) {
            me.form.add({
                items: formColumnItems[itemCounter]
            });
        }
    },

    /**
     * Returns all displayed elements of the filter
     *
     * @param {Array} filterItems
     * @returns {Array}
     *
     * @private
     */
    getDisplayedFilterElements: function (filterItems) {
        return Ext.Array.filter(filterItems, function (item) {
            if (!item.hasOwnProperty('xtype')) {
                return true;
            }

            return item.xtype !== 'hiddenfield';
        });
    },

    /**
     * Returns all hidden elements of the filter
     *
     * @param {Array} filterItems
     * @returns {Array}
     *
     * @private
     */
    getHiddenFilterElements: function (filterItems) {
        return Ext.Array.filter(filterItems, function (item) {
            if (!item.hasOwnProperty('xtype')) {
                return false;
            }

            return item.xtype === 'hiddenfield';
        });
    },

    /**
     * Adds elements to the last column
     *
     * @param {Array} allColumnElements
     * @param {Array} elementsToAdd
     *
     * @return {Array}
     *
     * @private
     */
    addElementsToLastColumn: function (allColumnElements, elementsToAdd) {
        if (allColumnElements.length > 0) {
            for (var singleElement = 0; singleElement < elementsToAdd.length; singleElement++) {
                allColumnElements[allColumnElements.length - 1].push(elementsToAdd[singleElement]);

            }
        } else {
            allColumnElements.push(elementsToAdd);
        }

        return allColumnElements;
    }
});
