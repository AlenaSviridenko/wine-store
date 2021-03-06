// using template as a function to use two-way binding with epoxy
var template = function() {
    return function() {
        return $('#modal').html($('#signup-template').html()).modal('toggle');
    }
};

App.Views.SignUpView = Backbone.Epoxy.View.extend({

    el: template(),

    events: {
        "submit #frm-signup": "signup",
        "blur #username": "checkUsername"
    },

    initialize: function() {
        Backbone.Validation.bind(this);
    },

    signup: function(e) {
        e.preventDefault();

        if (this.model.isValid(true)) {
            var self = this;
            var data = {
                username: this.model.get('username'),
                firstName: this.model.get('firstName'),
                lastName: this.model.get('lastName'),
                email: this.model.get('email'),
                password: this.model.get('password')
            };

            $.post('/users', { data: data }, function(data, response) {
                if(data && data.user && data.sid) {
                    App.user = data.user;
                    App.session.save(data.sid, data.user);
                    self.toggleHeaders();
                }
                $('#modal').modal('toggle');
            })
                .fail(function() {
                    $('#login-error').html('That username &amp; password was not found.').addClass('alert-message').addClass('error');
                });
        }
    },

    checkUsername: function (e) {
        var value = $(e.currentTarget).val();
        var url = '/users?username=' + value;
        var self = this;

        $.get(url)
            .then(function() {
                Backbone.Validation.callbacks.valid(self, 'username', 'name');
            }, function () {
                Backbone.Validation.callbacks.invalid(self, 'username', 'username already exists', 'name');
            });
    },

    bindings: {
        'input#username': 'value:username',
        'input#firstName': 'value:firstName',
        'input#lastName': 'value:lastName',
        'input#email': 'value:email',
        'input#password': 'value:password',
        'input#confirmPassword': 'value:confirmPassword'
    },
    toggleHeaders: function() {
        $('.public').toggle();
        $('.logged-in').toggle();

        if(App.user && !App.user.isAdmin) {
            $('#btn-additems').hide();
        }
    }
});