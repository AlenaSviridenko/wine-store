App.Models.Session = Backbone.Model.extend({
    defaults: {
        authToken: null,
        userData: null
    },

    initialize: function() {
        this.set('authToken', Cookies.get('authToken'));
        this.set('userData', Cookies.get('userData'));
    },

    isLoggedIn: function() {
        return this.get('authToken') && this.get('userData');
    },

    save: function(authToken, userData){
        Cookies.set('authToken', authToken);
        Cookies.set('userData', userData);
    },

    remove: function() {
        Cookies.remove('authToken');
        Cookies.remove('userData');

        this.unset('authToken');
        this.unset('userData');
    }
});