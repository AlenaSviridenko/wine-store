App.Collections.OrderCollection = Backbone.Collection.extend({
    model: App.Models.Order,
    url: '/orders'
});