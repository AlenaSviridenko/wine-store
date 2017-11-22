var template = function() {
    return function() {
        var template1 = _.template($('#account-template').html());
        this.model = new  App.Models.User(App.user);
        return template1({model: this.model.toJSON()});
    }
};

App.Views.AccountView = Backbone.Epoxy.View.extend({
    el: template(),

    events: {
        'click input[name="save"]': 'validateAndSave',
        'click input[name="edit"]': 'setEditView'
    },

    initialize: function() {
        Backbone.Validation.bind(this);
        this.listenTo(this.model, 'sync', this.render);
    },

    bindings: {
        'input[name="firstName"]': 'value:firstName',
        'input[name="lastName"]': 'value:lastName',
        'input[name="city"]': 'value:city',
        'input[name="country"]': 'value:country',
        'input[name="zip"]': 'value:zip',
        'input[name="street"]': 'value:street',
        'input[name="phone"]': 'value:phone'
    },

    render: function() {
        this.$el.empty();
        this.$el.append(template());

        $('#app').html(this.$el);

        this.delegateEvents();
        this.applyBindings();

        return this;
    },

    setEditView: function(e) {
        e.preventDefault();

        $('span.display-value').toggle();
        $('input[name="edit"]').toggle();

        $('input.edit').toggle();
    },

    validateAndSave: function() {
        var self = this;
        if (this.model.isValid(['firstName', 'lastName'])) {
            this.model.save(null, {success: function() {
                $('span.display-value').toggle();
                $('input[name="edit"]').toggle();
                $('input.edit').toggle();
            }});
        }
    }
});