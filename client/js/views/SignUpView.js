App.Views.SignUpView = Backbone.View.extend({
    events: {
        "submit #frm-signup": "signup"
    },


    initialize: function() {
        Backbone.Validation.bind(this);
        this.template = _.template($('#signup-template').html());
    },

    render: function() {
        this.stickit();
        $(this.$el).append(this.template());
        return this;
    },

    signup: function(e) {
        e.preventDefault();

        // See: http://thedersen.com/projects/backbone-validation/#methods/isvalid
        if (!this.model.isValid(true)) {
            // this.model.save();
            alert('!');
        }
    },

    bindings: {
        '#username': {
            observe: 'username',
            setOptions: {
                validate: true
            }
        },
        '#firstName': {
            observe: 'firstName',
            setOptions: {
                validate: true
            }
        },
        '#lastName': {
            observe: 'lastName',
            setOptions: {
                validate: true
            }
        },
        '#email': {
            observe: 'email',
            setOptions: {
                validate: true
            }
        },
        '#password': {
            observe: 'password',
            setOptions: {
                validate: true
            }
        },
        '#confirmPassword': {
            observe: 'conformPassword',
            setOptions: {
                validate: true
            }
        }
    }
});