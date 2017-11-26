App.Models.Wine = Backbone.Model.extend({
    url: '/wines',
    idAttribute: '_id',
    validation: {
        name: {
            required: true,
            msg: 'Please enter the name'
        },
        country: {
            required: true,
            msg: 'Please enter the country'
        },
        year: {
            min: 1,
            required: true,
            msg: 'Please enter the year'
        },
        type: {
            required: true,
            msg: 'Please enter the type'
        },
        desc: {
            required: true,
            msg: 'Please enter some description'
        },
        price: {
            min: 1,
            required: true,
            msg: 'Please set the price'
        },
        available: {
            min: 1,
            required: true,
            msg: 'Please set the available amount'
        },
        path: {
            required: true,
            msg: 'Please set the image path'
        }
    },

    defaults: {
        name:'',
        country:'',
        year: 0,
        type:'',
        desc:'',
        image: {
            imgurl:''
        },
        path: '',
        price: 0,
        available: 0
    }
});