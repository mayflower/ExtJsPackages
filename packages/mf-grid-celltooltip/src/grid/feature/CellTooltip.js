/**
 * This {@link Ext.grid.feature.Feature feature} adds tooltips to every cell of a {@link Ext.grid.Panel grid}.
 *
 * ## Example Usage
 *
 *     @example
 *     var store = Ext.create('Ext.data.Store', {
 *         storeId:'employeeStore',
 *         fields:['name', 'seniority', 'department'],
 *         data: {'employees':[
 *             { "name": "Michael Scott",  "seniority": 7, "department": "Management" },
 *             { "name": "Dwight Schrute", "seniority": 2, "department": "Sales" },
 *             { "name": "Jim Halpert",    "seniority": 3, "department": "Sales" },
 *             { "name": "Kevin Malone",   "seniority": 4, "department": "Accounting" },
 *             { "name": "Angela Martin",  "seniority": 5, "department": "Accounting" }
 *         ]},
 *         proxy: {
 *             type: 'memory',
 *             reader: {
 *                 type: 'json',
 *                 rootProperty: 'employees'
 *             }
 *         }
 *     });
 *
 *     Ext.create('Ext.grid.Panel', {
 *         title: 'Employees',
 *         store: Ext.data.StoreManager.lookup('employeeStore'),
 *         columns: [
 *             { text: 'Name',     dataIndex: 'name' },
 *             { text: 'Seniority', dataIndex: 'seniority' },
 *             { text: 'Department', dataIndex: 'department' }
 *         ],
 *         features: [{ftype:'celltooltip'}],
 *         width: 200,
 *         height: 275,
 *         renderTo: Ext.getBody()
 *     });
 */
Ext.define('Mayflower.grid.feature.CellTooltip', {
    extend: 'Ext.grid.feature.Feature',
    alias: 'feature.celltooltip',

    //private
    tooltip: null,

    /**
     * Registers {@link Mayflower.grid.feature.CellTooltip#addTooltip} on afterrender of the grid
     * to add a tooltip to every grid cell.
     * This has to be done in afterrender because the cell values may have been changed by a render function.
     *
     * @param {Ext.grid.Panel} grid
     * @private
     */
    init: function (grid) {
        var me = this;

        me.callParent(arguments);

        me.grid.on('afterrender', me.addTooltip, me);
    },

    /**
     * Destroys the created tooltip
     *
     * @private
     */
    destroy: function () {
        var me = this,
            tooltip = me.tooltip;

        if (tooltip) {
            tooltip.destroy();
        }

        me.tooltip = null;
        me.callParent();
    },

    /**
     * Adds tooltips to every cell of the grid
     * @private
     */
    addTooltip: function () {
        var view;

        view = this.grid.getView();
        this.tooltip = Ext.create('Ext.tip.ToolTip', {
            // The overall target element.
            target: view.el,
            // Each grid row causes its own separate show and hide.
            delegate: view.cellSelector,
            // Moving within the row should not hide the tip.
            trackMouse: true,
            // Render immediately so that tip.body can be referenced prior to the first show.
            renderTo: Ext.getBody(),
            minWidth:  1,
            maxWidth:  300,
            listeners: {
                // Change content dynamically depending on which element triggered the show.
                beforeshow: function updateTipBody(tip) {
                    var htmlEl = Ext.get(tip.triggerElement).dom,
                        value;
                    /*
                     * use HTMLElement's text property here instead of getting the record because the
                     * record's value may have been changed by a column renderer
                     */
                    value = htmlEl.textContent || htmlEl.innerText;

                    tip.update(value);
                }
            }
        });
    }
});
