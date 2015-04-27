/**
 * Controller for {@link Mayflower.grid.feature.FilterForm FilterForm}
 */
Ext.define('Mayflower.grid.feature.FilterFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.filterform',

    /**
     * Apply filter form values to grid
     */
    onApplyFilters: function () {
        var view = this.getView(),
            store = view.up().getStore(),
            formValues = view.getForm().getValues(),
            filters = this.buildFilter(formValues);

        store.clearFilter();
        store.setFilters(filters);
    },

    /**
     * Reset filter form values
     */
    onResetFilters: function () {
        this.getView().getForm().reset();
    },

    /**
     * Build filters for given form values, as consumed by {@see Ext.store.Store#setFilters Store setFilters} function.
     *
     * @param {Object} formValues
     * @returns {Function[]} array of filter functions
     *
     * @private
     */
    buildFilter:  function (formValues) {
        var filters = [];

        Ext.iterate(formValues, function (key, value) {
            if (!Ext.isEmpty(value)) {
                filters.push(function (item) {
                    var itemValue = item.get(key);

                    if (Ext.isString(itemValue)) {
                        return Ext.String.startsWith(itemValue, value);
                    }
                    return itemValue === value;
                });
            }
        });

        return filters;
    }
});
