App.Views.MyOdersView = Backbone.View.extend({
    tagName: 'table',
    className: 'table table-striped order-list',

    initialize: function() {
        _.bindAll(this, 'fetch', 'render');
    },

    fetch: function(options) {
        options = options || {};
        var self = this;

        options.success = function(collection, response) {
            collection = collection.toJSON();

            if(!collection.length) {
                alert('Nothing found!');
                return;
            }
            self.render(collection);
        };

        this.collection.fetch(options);
    },

    render: function(collection) {
        if (collection) {
            this.$el.empty();

            _.each(collection, function(item) {
                var orderView = new App.Views.SingleOrderView({model: item});
                this.$el.append(orderView.render().el)
            }, this);

            $('#app').html(this.$el);
            return this;
        }
    }
});