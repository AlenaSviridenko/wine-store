WinificationRouter = Backbone.Router.extend({
    routes: {
        '': 'index',
        'mybucket': 'bucket',
        'search/*search': 'search',
        'account': 'account',
        'addItem': 'addItem',
        'myorders': 'myorders'
    },

    views: {},

    initialize: function() {
        _.bindAll(this, 'index', 'bucket', 'myorders', 'search', 'addItem', 'account');

        this.views.app = new App.Views.AppView();
        this.views.public = new App.Views.PublicView();
        App.globals.bucket = new App.Views.BucketView({collection: new App.Collections.BucketCollection()});
        this.views.app.render();
    },

    index: function() {
        this.views.public.fetch();
        this.renderRoute(this.views.public);
    },

    bucket: function() {
        App.globals.bucket.render();
    },

    myorders: function() {
        this.views.myorders = new App.Views.MyOdersView({collection: new App.Collections.OrderCollection()});
        var userQuery = {
            userId: App.user._id
        };
        this.views.myorders.fetch({ data: userQuery });
        this.renderRoute(this.views.myorders);
    },

    search: function(search) {
        var searchObject = {
            $or: [
                {
                    country: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    type: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    desc: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ]
        };
        this.views.public.fetch({ data: searchObject });
        this.renderRoute(this.views.public);
    },

    account: function() {
        this.views.account = new App.Views.AccountView({model: new App.Models.User(App.user)});
        this.renderRoute(this.views.account);
    },

    addItem: function() {
        this.views.addItem = new App.Views.NewItemView({model: new App.Models.Wine()});
        this.renderRoute(this.views.addItem);
    },

    renderRoute: function(view) {
        if (this.currentView) {
            this.currentView.remove();
        }

        //render the new view
        view.render();

        //Set the current view
        this.currentView = view;

        return this;
    }
});