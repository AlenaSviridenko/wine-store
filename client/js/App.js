window.App = {
    Models: {},
    Collections: {},
    Views: {},
    globals: {},
    events: {},

    initialize: function() {

        //If Backbone sync gets 403, it means the user's
        //session has expired, so send them back to the homepage
        var sync = Backbone.sync;
        Backbone.sync = function(method, model, options) {
            options.error = function(xhr) {
                if (xhr.status === 403) {
                    window.location = '/';
                }
            };
            sync(method, model, options);
        };

        Backbone.View.prototype.eventAggregator = _.extend({}, Backbone.Events);

        this.router = new WinificationRouter();

        // navigation by <a>
        $(document).on('click', 'a:not([data-bypass])', function(evt) {
            var href = { prop: $(this).prop('href'), attr: $(this).attr('href') };
            var root = location.protocol + '//' + location.host + Backbone.history.options.root;

            if (href.prop && href.prop.slice(0, root.length) === root) {
                evt.preventDefault();
                Backbone.history.navigate(href.attr, true);
            }
        });

        // handling errors from Backbone.Validation
        _.extend(Backbone.Validation.callbacks, {
            valid: function (view, attr, selector) {
                var $el = view.$('[name=' + attr + ']'),
                    $group = $el.closest('.form-group');

                $group.removeClass('has-error');
                $group.find('.help-block').html('').addClass('hidden');
            },
            invalid: function (view, attr, error, selector) {
                var $el = view.$('[name=' + attr + ']'),
                    $group = $el.closest('.form-group');

                $group.addClass('has-error');
                $group.find('.help-block').html(error).removeClass('hidden');
            }
        });

        // monitoring route change events
        Backbone.history.start({pushState: true});
    }
};