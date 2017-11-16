App.Views.ItemView = Backbone.View.extend({
    events: {
        'click .addToBucket': 'addToBucket'
    },

    tagName: 'tr',

    initialize: function () {
        this.render();
    },

    render: function() {
        var template = _.template($('#item-template').html());
        this.$el.html(template({model: this.model}));
        return this;
    },

    addToBucket: function() {
        App.globals.bucket.collection.add(this.model);
        
    }
});