App.Views.ItemView = Backbone.View.extend({
    events: {
        'click .addToBucket': 'addToBucket',
        'click .quantity-right-plus': 'incrementQuantity',
        'click .quantity-left-minus': 'decrementQuantity'
    },

    tagName: 'tr',

    initialize: function () {
        _.bindAll(this, 'addToBucket', 'incrementQuantity', 'decrementQuantity');
        this.template = _.template($('#item-template').html());
    },

    render: function() {
        this.$el.empty();
        this.$el.append(this.template({model: this.model}));
        return this;
    },

    addToBucket: function(e) {
        this.model.quantity = parseInt($(e.target).closest('td').prev('td').find('.quantity-number').val());
        App.globals.bucket.collection.add(this.model, {merge: true});
    },

    incrementQuantity: function(e) {
        e.preventDefault();
        var $quantity = $(e.target).closest('div').find('.quantity-number');

        var quantity = parseInt($quantity.val());
        if (quantity + 1 > this.model.available) {
            return;
        }

        $quantity.val(quantity + 1).change();
    },

    decrementQuantity: function(e) {
        e.preventDefault();
        var $quantity = $(e.target).closest('div').find('.quantity-number');

        var quantity = parseInt($quantity.val());
        if (quantity - 1 <= 0) {
            return;
        }

        $quantity.val(quantity - 1).change();
    }
});