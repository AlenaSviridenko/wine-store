App.Views.SingleOrderView = Backbone.View.extend({
    tagName: 'tr',

    initialize: function () {
        this.template = _.template($('#order-template').html());
    },

    render: function() {
        this.$el.empty();
        this.$el.append(this.template({model: this.model}));
        return this;
    }
});