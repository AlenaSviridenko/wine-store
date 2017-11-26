App.Models.Order = Backbone.Model.extend({
    url: '/orders',
    defaults: {
        items: [],
        userId: '',
        totalSum: 0
    }
});