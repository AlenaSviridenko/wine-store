App.Views.BucketView = Backbone.View.extend({

    events: {
        'click #sendOrder': 'sendOrder'
    },

    el: '#app',

    initialize: function() {
        _.bindAll(this, 'render');
        this.collection.on('add', this.fireSubscription, this);

        this.template = _.template($('#bucket-template').html());
    },

    render: function() {
        $(this.el).html(this.template({collection: this.collection.toJSON(), total: this.countTotal()}))
    },

    countTotal: function() {
        var total = 0;
        _.each(this.collection.toJSON(), function(item) {
            total += item.price * item.quantity;
        });

        return total;
    },

    fireSubscription: function() {
        var commonCount = 0;
        _.each(this.collection.toJSON(), function (item) {
            commonCount += item.quantity;
        });


        this.eventAggregator.trigger('itemAdded', {length: commonCount});
    },

    sendOrder: function() {
        if (!App.user) {
            alert('please, sign in or sign up for order');
            return;
        }

        if (!this.addressFilledCorrectly()) {
            alert('please fill in your address on your account page');
            return;
        }

        if (this.addressFilledCorrectly()) {
            var collectionArray = this.collection.toJSON();
            var itemsAray = collectionArray.reduce(function(item) {
                return {
                    itemId: item._id,
                    quantity: item.quantity
                }
            }, []);
            console.log('');
        }
    },

    addressFilledCorrectly: function () {
        return App.user && App.user.street && App.user.zip && App.user.city && App.user.country;
    }
});