WinificationRouter = Backbone.Router.extend({
    routes: {
        "":                                 "index",
        "mybucket":                             "bucket",
        "tag/:tag":                             "tag",
        "mytags":                               "tags",
        "search/*search":                       "search",
        "account":                              "account",
        "bookmarklet/*params":                  "bookmarklet"
    },

    views: {},

    initialize: function() {
        _.bindAll(this, 'index', 'bucket', 'tag', 'tags', 'search', 'bookmarklet', 'setBody');

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
        this.views.public.render();
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
        this.setBody(this.views.account, true);
        this.view.body.render();
    },

    bookmarklet: function(params) {
        this.setBody(this.views.bookmarks, true);
        this.view.body.fetch();

        var regex = /\?url=(.*?)&title=(.*)/gi
        matches = regex.exec(params);
        var url = matches[1];
        var title = matches[2];
        var bookmark = { url: url, title: title };
        new EditView({ model: new Bookmark(bookmark) }).render();
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