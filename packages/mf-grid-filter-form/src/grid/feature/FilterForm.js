/**
 * This {@link Ext.grid.feature.Feature grid feature} adds a form to the grid with filter options
 * similar to {@link Ext.grid.filters.Filters}.
 *
 * The filter form is docked to the bottom of the {@link Ext.grid.Panel grid}.
 */
Ext.define('Mayflower.grid.feature.FilterForm', {
    extend: 'Ext.grid.feature.Feature',
    alias: 'feature.filterform',

    /**
     * @cfg {Boolean} hiddenResetButton
     * true to hide the filter form reset button.
     */
    hiddenResetButton: false,

    //<locale>
    showButtonText: 'Show',
    //</locale>
    //<locale>
    showButtonTooltipText: '',
    //</locale>
    //<locale>
    resetButtonText: 'Reset',
    //</locale>
    //<locale>
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
                var filterItems = me.buildFilterOptionItems(grid.getColumnManager().getColumns());

                if (filterItems.length === 0) {
                    return;
                }

                me.form.add(filterItems);
                grid.insertDocked(0, me.form);
            }
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
