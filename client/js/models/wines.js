App.Models.Wine = Backbone.Model.extend({
    defaults: {
        name:'',
        description: {
            country:'',
            year:0,
            type:'',
            desc:''
        },
        images:{
            imgurl:''
        },
        price: 0,
        quantity: 0
    }
});