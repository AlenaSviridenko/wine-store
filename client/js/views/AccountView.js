var template = function() {
    return function() {
        var template1 = _.template($('#account-template').html());
        App.user.address = App.user.address || {};
        return $('#app').html(template1({model: App.user}));
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
        'input[name="city"]': 'value:address.city',
        'input[name="country"]': 'value:address.country',
        'input[name="zip"]': 'value:address.zip',
        'input[name="street"]': 'value:address.street'
    },

    setEditView: function(e) {
        e.preventDefault();

        $('span.display-value').toggle();
        $('input[name="edit"]').toggle();

        $('input.edit').toggle();
    }
});