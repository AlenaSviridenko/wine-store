App.Collections.WinesCollection = Backbone.Collection.extend({
    model: App.Models.Wine,
    url: '/wines'
});