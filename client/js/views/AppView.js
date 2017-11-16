App.Views.AppView = Backbone.View.extend({

        events: {
            "click  #btn-home": "home",
            "click  #btn-myorders": "myorders",
            "click  #btn-mybucket": "mybucket",
            "click  #btn-account": "account",
            "click  #btn-logout": "logout",
            "click  #btn-login": "toggleLogin",
            "submit #frm-search": "search",
            "submit #frm-login": "login"
        },

        initialize: function() {
            _.bindAll(this, 'render', 'search', 'home', 'myorders', 'mybucket', 'account', 'logout', 'toggleLogin', 'login');
            this.eventAggregator.bind('itemAdded', this.render);
        },

        render: function(e) {
            var template = _.template($('#header-template').html());
            $('#header').html(template({itemsLength: (e ? e.length : 0)}));

            $('#login1').hide();
            $('#signup1').hide();

            if (typeof App.user !== 'undefined') {
                $('.public').show();
                $('.logged-in').hide();
            }
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
            /*e.preventDefault();
            /*

            l = $(e.target).offset().left;
            t = $(e.target).offset().top;
            height = $(e.target).outerHeight();
            width = $(e.target).outerWidth();

            $('#login').css('top', t + height)
                .css('left', l - 328)
                .toggle();*/
        },

        login: function(e) {
            e.preventDefault();

            var username = $('#login input[name=username]').val();
            var password = $('#login input[name=password]').val();

            $.ajax({
                type: 'POST',
                url: '/json/login',
                dataType: 'json',
                data: { username: username, password: password },
                success: function(data) {
                    $('#header .public').hide();
                    $('#header .logged-in').show();
                    App.user = data;
                    App.router.navigate('bookmarks', true);
                },
                error: function() {
                    $('#login-error').html('That username &amp; password was not found.').addClass('alert-message').addClass('error');
                }
            });

        }

    });