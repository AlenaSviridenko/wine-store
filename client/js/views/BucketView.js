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

        }
    },

    addressFilledCorrectly: function () {
        return App.user && App.user.address && App.user.address.street && App.user.address.zip && App.user.address.city && App.user.address.country;
    }
});