App.Views.AppView = Backbone.View.extend({

    el: '#header',

    events: {
        "click  #btn-home": "home",
        "click  #btn-mybucket": "mybucket",
        "click #login": "toggleLogin",
        "click #signup": "toggleSignup",
        "submit #frm-login": "login"
    },

    initialize: function() {
        _.bindAll(this, 'render', 'search', 'home',  'mybucket', 'toggleLogin');
        this.eventAggregator.bind('itemAdded', this.render);
        this.template = _.template($('#header-template').html());

        //$('#frm-login').on('submit', this.login);
    },

    render: function(e) {
        //var template = ;
        this.$el.append(this.template({itemsLength: (e ? e.length : 0)}));

        if (typeof App.user !== 'undefined') {
            //$('.public').hide();
            //$('.logged-in').show();
        }

        return this;
    },

    home: function(e) {
        e.preventDefault();
        App.router.navigate('', true);
    },

    search: function(e) {
        e.preventDefault();
        var term = $(e.target).find('input').val();
        $(e.target).find('input').val('').blur();
        App.router.navigate('search/' + term, true);
    },

    myorders: function(e) {
        e.preventDefault();
        App.router.navigate('mytags', true);
    },

    mybucket: function(e) {
        e.preventDefault();
        App.router.navigate('mybucket', true);
        //new EditView({ model: new Bookmark() }).render();
    },

    account: function(e) {
        e.preventDefault();
        App.router.navigate('account', true);
    },

    logout: function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/json/logout',
            dataType: 'json',
            success: function(data) {
                window.location = '/';
            }
        });
    },

    toggleLogin: function(e) {
        e.preventDefault();

        var $modal = $('#modal');

        var loginTemplate = _.template($('#login-template').html());
        $modal.html(loginTemplate());
        $modal.modal('toggle');
    },

    toggleSignup: function(e) {
        e.preventDefault();

        var signUp = new App.Views.SignUpView({model: new App.Models.User()});
        signUp.render();
    },

    login: function(e) {
        e.preventDefault();

        var username = $('#username').val();
        var password = $('#password').val();

        $.ajax({
            type: 'POST',
            url: '/login',
            dataType: 'json',
            data: { username: username, password: password },
            success: function(data) {
                $('#header .public').hide();
                $('#header .logged-in').show();
                App.user = data;
                $('#modal').modal('toggle');
            },
            error: function() {
                $('#login-error').html('That username &amp; password was not found.').addClass('alert-message').addClass('error');
            }
        });

    },

    signupqweqew: function(e) {
        e.preventDefault();

        if (!$(e.currentTarget).valid()) {
            alert('!')
        }
        var username = $('#username').val();
        var password = $('#password').val();

        /*$.ajax({
            type: 'POST',
            url: '/login',
            dataType: 'json',
            data: { username: username, password: password },
            success: function(data) {
                $('#header .public').hide();
                $('#header .logged-in').show();
                App.user = data;
                $('#modal').modal('toggle');
            },
            error: function() {
                $('#login-error').html('That username &amp; password was not found.').addClass('alert-message').addClass('error');
            }
        });*/

    }

});