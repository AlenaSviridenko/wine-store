var template = function() {
    return function() {
        var template1 = _.template($('#account-template').html());
        App.user.address = App.user.address || {};
        this.model.attributes = _.extend({}, this.model.attributes, App.user);
        return $('#app').html(template1({model: this.model.toJSON()}));
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

    setEditView: function(e) {
        e.preventDefault();

        $('span.display-value').toggle();
        $('input[name="edit"]').toggle();

        $('input.edit').toggle();
    },

    validateAndSave: function() {
        if (this.model.isValid(['firstName', 'lastName'])) {
            this.model.save();
        }
    }
});