describe('Mayflower grid filter form controller test suite', function () {
    describe('Grid filter helper function tests', function () {
        var controller = Ext.create('Mayflower.grid.feature.FilterFormController');

        it('should return the correct filter', function () {
            var filters = controller.buildFilter({a: 'a', b: 'b'}),
                item = {
                    get: function () {
                        return 'a';
                    }
                };
            expect(filters.length).toBe(2);
            expect(filters[0](item)).toBeTruthy();
            expect(filters[1](item)).toBeFalsy();
        });
    });
});
