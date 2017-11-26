App.Views.AppView = Backbone.View.extend({

    el: '#header',

    events: {
        "click  #btn-home": "home",
        "click  #btn-mybucket": "mybucket",
        "click  #btn-account": "account",
        "click  #btn-logout": "logout",
        "click  #btn-additems": 'addItem',
        "click  #btn-myorders": 'myOrders',
        "click #login": "toggleLogin",
        "click #signup": "toggleSignup",
        "submit #frm-login": "login",
        'click input[name="search"]': 'search'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'search', 'home',  'mybucket', 'toggleLogin', 'search');
        this.eventAggregator.bind('itemAdded', this.render);
        this.template = _.template($('#header-template').html());
    },

    render: function(e) {
        this.$el.empty();
        this.$el.append(this.template({itemsLength: (e ? e.length : 0)}));
        App.session = new App.Models.Session();

        if (App.session.isLoggedIn()) {
            App.user = JSON.parse(App.session.get('userData'));
            this.toggleHeaders();
        }

        return this;
    },

    home: function(e) {
        e.preventDefault();
        App.router.navigate('', true);
    },

    myOrders: function(e) {
        e.preventDefault();
        App.router.navigate('myorders', true);
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

    addItem: function(e) {
        e.preventDefault();
        App.router.navigate('addItem', true);
    },

    logout: function(e) {
        e.preventDefault();
        $.post('/logout', function() {
            App.session.remove();
            window.location = '/';
        })
        .fail(function(error) {
            console.log(error);
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

        var data = {
            username: $('#username').val(),
            password: $('#password').val()
        };
        var self = this;

        $.post('/login', data,  function(data){
                if(data && data.user && data.sid) {
                    App.user = data.user;
                    App.session.save(data.sid, data.user);
                    self.toggleHeaders();
                }

                $('#modal').modal('toggle');
            })
            .fail( function() {
                $('#login-error').html('That username &amp; password was not found.').addClass('alert-message').addClass('error');
        });
    },

    search: function(e) {
        e.preventDefault();
        var value = $('input[name="searchBox"]').val() || '';

        App.router.navigate('search/' + value, true);
    },

    toggleHeaders: function() {
        $('.public').toggle();
        $('.logged-in').toggle();

        if(App.user && !App.user.isAdmin) {
            $('#btn-additems').hide();
        }
    }
});