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
    images: { type: Images, required: true }
});

var User = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: {
        street: { type: String },
        zip: { type: String },
        city: { type: String },
        country: { type: String }
    }
});

module.exports.WineModel = mongoose.model('Wines', Wine);
module.exports.ImageModel = mongoose.model('Images', Images);
module.exports.UserModel = mongoose.model('User', User);