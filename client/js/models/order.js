App.Models.Order = Backbone.Model.extend({
    urlRoot: '/orders',
    defaults: {
        items: [],
        userId: '',
        totalSum: 0
    }
});