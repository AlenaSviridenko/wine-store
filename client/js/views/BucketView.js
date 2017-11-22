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
        var self = this;
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
            var itemsArray = collectionArray.reduce(function(acc, item) {
                acc.push({
                    itemId: item._id,
                    quantity: item.quantity
                });

                return acc;
            }, []);

            var order = new App.Models.Order({
                items: itemsArray,
                userId: App.user._id,
                totalSum: this.countTotal()
            });

            order.save(null, {
                success: function (result) {
                    console.log('Success');
                    self.collection.reset();
                    self.fireSubscription();
                    App.router.navigate('', true);
                    alert('Success');
                }
            })
        }
    },

    addressFilledCorrectly: function () {
        return App.user && App.user.street && App.user.zip && App.user.city && App.user.country;
    }
});