App.Models.User = Backbone.Model.extend({
    urlRoot: '/users',
    idAttribute: '_id',
    validation: {
       firstName: {
           required: true,
           msg: 'Please enter your first name'
       },
       lastName: {
           required: true,
           msg: 'Please enter your last name'
       },
       email: {
           required: true,
           pattern: 'email',
           msg: 'Please enter a valid email'
       },
       password: [
           {
               required: true,
               msg: 'Please enter password'
           },
           {
               minLength: 5,
               msg: 'Password must be at least 5 characters long'
           }
       ],
       confirmPassword: [
           {
               required: true,
               msg: 'Please enter your password again'
           },
           {
               equalTo: 'password',
               msg: 'Passwords must match'
           }
       ],
       username: {
           required: true,
           msg: 'Please enter your username'
       }
    },

    parse: function(result) {
        App.user = result.user;
        Cookies.set('userData', result.user);
    },

    defaults: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        phone: '',
        city: '',
        country: '',
        street: '',
        zip: ''
    }
});