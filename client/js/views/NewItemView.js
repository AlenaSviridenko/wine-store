// using template as a function to use two-way binding with epoxy
var itemTemplate = function() {
    return function() {
        var template = _.template($('#newitem-template').html());
        return template();
    }
};

App.Views.NewItemView = Backbone.Epoxy.View.extend({
    el: itemTemplate(),

    events: {
        'click input[name="save"]': 'save',
        'click button.close': 'close'
    },

    initialize: function() {
        _.bindAll(this, 'save', 'close');
        Backbone.Validation.bind(this);
    },

    bindings: {
        'input[name="name"]': 'value:name',
        'select[name="type"]': 'value:type',
        'input[name="country"]': 'value:country',
        'textarea[name="desc"]': 'value:desc',
        'input[name="path"]': 'value:path',
        'input[name="quantity"]': 'value:available',
        'input[name="year"]': 'value:year',
        'input[name="price"]': 'value:price'
    },

    render: function(){
        this.$el.empty();
        this.$el.append(itemTemplate());

        $('#app').html(this.$el);

        this.delegateEvents();
        this.applyBindings();

        return this;
    },

    save: function() {
        if (this.model.isValid(true)) {
            this.model.set('image', {imgurl: this.model.path});
            this.model.set({price: parseInt(this.model.get('price'))});
            this.model.save(null, {
                success: function () {
                    alert('Item saved!');
                    window.location = '/';
                }
            })
        }
    },

    close: function() {
        this.remove();
    }
});