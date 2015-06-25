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

        store.clearFilter(true);

        store.setFilters(filters);

        if (Ext.isEmpty(filters)) {
            store.load();
        }
    },

    /**
     * Reset filter form values
     *
     * @param {String} id
     */
    onResetFilters: function (id) {
        var view = this.getView(),
            store = view.up().getStore(),
            form = view.getForm();

        if (Ext.isString(id)) {
            formField = form.findField(id);

            if (formField !== null) {
                formField.reset();
                store.removeFilter(id, true);
            }
        } else {
            form.reset();
            store.clearFilter(true);
        }
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
                filters.push(new Ext.util.Filter({
                    operator: 'like',
                    property: key,
                    value: value
                }));
            }
        });

        return filters;
    }
});
