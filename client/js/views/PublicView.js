App.Views.PublicView = Backbone.View.extend({
    tagName: 'table',
    className: 'catalog',

    initialize: function() {
        _.bindAll(this, 'fetch', 'render');
        this.collection = new App.Collections.WinesCollection();
    },

    fetch: function(options) {
        var self = this;
        this.collection.fetch(
            {
                success: function(collection, response) {
                    collection = collection.toJSON();
                    self.render(collection);
                }
            }
        );
    },

    unrender: function() {
        $(this.el).detach();
    },

    render: function(collection) {
        if (collection) {
            this.$el.empty();

            _.each(collection, function(item) {
                var itemView = new App.Views.ItemView({model: item});
                this.$el.append(itemView.render().el)
            }, this);

            $('#app').html(this.$el);
            return this;
        }
    }
});
