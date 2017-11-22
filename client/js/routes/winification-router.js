WinificationRouter = Backbone.Router.extend({
    routes: {
        "":                                 "index",
        "mybucket":                             "bucket",
        "tag/:tag":                             "tag",
        "mytags":                               "tags",
        "search/*search":                       "search",
        "account":                              "account",
        "addItem":                  "addItem"
    },

    views: {},

    initialize: function() {
        _.bindAll(this, 'index', 'bucket', 'tag', 'tags', 'search', 'setBody');

        this.views.app = new App.Views.AppView();
        this.views.public = new App.Views.PublicView();
        App.globals.bucket = new App.Views.BucketView({collection: new App.Collections.BucketCollection()});
        /*//Create all the views, but don't render them on screen until needed

        this.views.bookmarks = new BookmarksView();
        this.views.pub = new PublicView();
        this.views.tags = new TagsView();
        this.views.account = new AccountView();*/

        //The "app view" is the layout, containing the header and footer, for the app
        //The body area is rendered by other views
        //this.view = this.views.app;
        this.views.app.render();
    },

    index: function() {
        //if the user is logged in, show their bookmarks, otherwise show the signup form

        this.views.public.fetch();
        this.renderRoute(this.views.public);
        //this.views.public.render();
        /*if (typeof App.user !== 'undefined') {
            this.navigate("bookmarks", true);
        } else {
            this.setBody(this.views.pub);
            this.view.body.render();
        }*/
    },

    bucket: function() {
        App.globals.bucket.render();
    },

    tag: function(tag) {
        this.setBody(this.views.bookmarks, true);
        this.view.body.fetch({ data: { tag: tag } });
    },

    search: function(search) {
        this.setBody(this.views.bookmarks, true);
        this.view.body.fetch({ data: { search: search } });
    },

    tags: function() {
        this.setBody(this.views.tags, true);
        this.view.body.fetch();
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
    },

    setBody: function(view, auth) {
        if (auth == true && typeof App.user == 'undefined') {
            this.navigate("", true);
            return;
        }

        if (typeof this.view.body != 'undefined')
            this.view.body.unrender();

        this.view.body = view;
    }

});