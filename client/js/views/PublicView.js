App.Views.PublicView = Backbone.View.extend({
    tagName: 'table',
    className: 'catalog',

    initialize: function() {
        _.bindAll(this, 'fetch', 'render');
        this.collection = new App.Collections.WinesCollection();
        this.collection.on("reset", this.updateView);
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

    render: function(collection) {
        if (collection) {
            _.each(collection, function(item) {
                var itemView = new App.Views.ItemView({model: item});
                this.$el.append(itemView.render().el)
            }, this);

            return this;
        }

        $('#app').html(this.$el);
    },

    updateView: function() {
        this.remove();
        this.render();

    }
    /*render: function() {

        var template = _.template($('#public-template').html());
        if (collection) {
            $(this.el).html(template({model: this.model.toJSON()}));
        }
        return this;
    },*/
});
