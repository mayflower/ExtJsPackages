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
 *     filterOption: {
 *         formPosition: 1
 *     }
 */
Ext.define('Mayflower.grid.feature.FilterForm', {
    extend: 'Ext.grid.feature.Feature',
    requires: [ 'Mayflower.grid.feature.FilterFormController' ],
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

    form: undefined,

    //private
    init: function (grid) {
        var me = this;

        me.callParent(arguments);

        me.form = Ext.create({
            xtype: 'form',
            controller: 'filterform',
            dock: 'bottom',
            itemId: 'grid-filter-form',
            height: 100,
            border: false,
            defaults: {
                anchor: '90%',
                allowBlank: true,
                labelAlign: 'left',
                labelWidth: 100,
                msgTarget: 'side'
            },
            defaultType: 'textfield',
            dockedItems: me.createFilterFormToolbar()
        });

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
                me.form.add(filterItems);

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
     * Sort the columns by the "formPosition" property.
     *
     * @param {Ext.grid.column.Column[]} columns
     * @returns {Ext.grid.column.Column[]}
     *
     * @private
     */
    getColumnsSortedByFormPosition: function (columns) {
        var sortedColumns = Ext.Array.sort(columns, function (a, b) {
            if (a.formPosition !== undefined && b.formPosition !== undefined) {
                return (a.formPosition < b.formPosition) ? -1 : 1;
            }

            if (a.formPosition === undefined) {
                return 1;
            }
            // b.formPosition is undefined
            return -1;
        });

        return sortedColumns;
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
                stateId: me.title + '-' + item.dataIndex
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
                handler:
                    function () {
                    me.form.getController().onResetFilters(arguments);
                }
            }]
        });
    }
});
