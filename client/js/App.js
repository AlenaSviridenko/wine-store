window.App = {
    Models: {},
    Collections: {},
    Views: {},
    globals: {},
    events: {},

    initialize: function() {

        //If Backbone sync gets an unauthorized header, it means the user's
        //session has expired, so send them back to the homepage
        var sync = Backbone.sync;
        Backbone.sync = function(method, model, options) {
            options.error = function(xhr, ajaxOptions, thrownError) {
                if (xhr.status == 401) {
                    window.location = '/';
                }
            };
            sync(method, model, options);
        };
        Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

        this.router = new WinificationRouter();

        $(document).on("click", "a:not([data-bypass])", function(evt) {
            var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
            var root = location.protocol + "//" + location.host + Backbone.history.options.root;

            if (href.prop && href.prop.slice(0, root.length) === root) {
                evt.preventDefault();
                Backbone.history.navigate(href.attr, true);
            }
        });

        Backbone.history.start({pushState: true});
    }
};