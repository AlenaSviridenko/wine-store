App.Views.ItemView = Backbone.View.extend({
    events: {
        'click .addToBucket': 'addToBucket',
        'click .quantity-right-plus': 'incrementQuantity',
        'click .quantity-left-minus': 'decrementQuantity'
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

    addToBucket: function(e) {
        this.model.quantity = parseInt($(e.target).closest('td').find('.quantity-number').val());
        App.globals.bucket.collection.add(this.model);
        
    },

    incrementQuantity: function(e) {
        e.preventDefault();
        var $quantity = $(e.target).closest('div').find('.quantity-number');

        var quantity = parseInt($quantity.val());

        $quantity.val(quantity + 1);
    },

    decrementQuantity: function(e) {
        e.preventDefault();
        var $quantity = $(e.target).closest('div').find('.quantity-number');

        var quantity = parseInt($quantity.val());
        if (quantity - 1 < 0) {
            return;
        }

        $quantity.val(quantity - 1);
    }
});