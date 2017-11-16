App.Views.BucketView = Backbone.View.extend({

    el: '#app',

    initialize: function() {
        _.bindAll(this, 'render');
        this.collection.on('add', this.fireSubscriptionAndRender, this);
    },

    render: function() {
        var template = _.template($('#bucket-template').html());
        $(this.el).html(template({collection: this.collection.toJSON(), total: this.countTotal()}))
    },

    countTotal: function() {
        var total = 0;
        _.each(this.collection.toJSON(), function(item) {
            total += item.price * 1;
        });

        return total;
    },

    fireSubscriptionAndRender: function() {
        this.eventAggregator.trigger('itemAdded', {length: this.collection.toJSON().length});
        this.render();
    }
});