var mongoose = require('mongoose');
var log = require('./log')(module);
var config = require('../config.json');

mongoose.connect(config.mongo.uri, {useMongoClient: true});
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

var Schema = mongoose.Schema;

// Schemas
var Images = new Schema({
    imgurl: { type: String, required: true }
});

var Wine = new Schema({
    name: { type: String, required: true },
    description: {
        country: { type: String, required: true },
        year: { type: Number, required: true },
        type: { type: String, required: true },
        desc: { type: String }
    },
    images: { type: Images, required: true },
    price: { type: Number, required: true}
});

// validation
Wine.path('name').validate(function (v) {
    return v.length > 5 && v.length < 70;
});

var WineModel = mongoose.model('Wines', Wine);
var ImageModel = mongoose.model('Images', Images);


module.exports.WineModel = WineModel;
module.exports.ImageModel = ImageModel;