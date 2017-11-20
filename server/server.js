var express = require('express');
var path = require('path');
var bcrypt = require('bcrypt');
var log = require('./utils/log')(module);
var config = require('./config.json');

var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();

var salt = '20sdkfjk23';
var dbModels = require('./utils/mongo');

var WineModel = dbModels.WineModel;
var ImageModel = dbModels.ImageModel;
var UserModel = dbModels.UserModel;

var getHash = function (password) {
    return bcrypt.hashSync(password, 10);
};

var verifyPassword = function(password, hash) {
 return bcrypt.compareSync(password, hash);
};

app.set('port', config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ secret: salt/*, store: new RedisStore*/, cookie: { maxAge: 3600000 * 24 * 30 } }));

// parse application/json
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('../client'));

app.listen(config.port, function () {
    console.log('Running on port ' + config.port)
});

app.post('/login', function(req, res) {
    return UserModel.findOne({username: req.body.username}, function(err, user) {
        if (!err && user) {
            log.error(req.body.password);
            log.error(user.toJSON());
            if (verifyPassword(req.body.password, user.password)) {
                return res.send(user);
            }
            res.statusCode = 404;
            log.error('Username/password are not matched');
            return res.send({ error: 'Username/password are not matched' });
        }
        res.statusCode = 404;
        log.error('User not found');
        return res.send({ error: 'User not found' });
    })
});

app.post('/signup', function(req, res) {
    log.error(req.body.password);
    var user = new UserModel({
        username: req.body.username,
        password: getHash(req.body.password),
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        'address.street': req.body.street,
        'address.zip': req.body.zip,
        'address.city': req.body.city,
        'address.country': req.body.country
    });

    user.save(function (err) {
        if (!err) {
            return res.send({ status: 'OK', user: user });
        } else {
            console.log(err);
            if(err.name === 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s',res.statusCode,err.message);
        }
    });
});

app.get('/wines', function(req, res) {
    return WineModel.find(function (err, articles) {
        if (!err) {
            return res.send(articles);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

app.post('/wines', function(req, res) {
    var wine = new WineModel({
        name: req.body.name,
        'description.country': req.body['description.country'],
        'description.year': req.body['description.year'],
        'description.type': req.body['description.type'],
        'description.desc': req.body['description.desc'],
        images: new ImageModel({imgurl: req.body.images})
    });

    wine.save(function (err) {
        if (!err) {
            log.info('Wine saved!');
            return res.send({ status: 'OK', wine: wine });
        } else {
            console.log(err);
            if(err.name === 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            log.error('Internal error(%d): %s',res.statusCode,err.message);
        }
    });
});

app.post('/users', function(req, res) {
    res.send('POST users');
});

app.get('/users', function(req, res) {
    console.log(req.query.username);
    var query = req.query;

    if (query && query.username) {
        return UserModel.findOne({username: query.username}, function (err, user) {
            if (!err && !user) {
                res.statusCode = 200;
                return res.send({});
            } else if (!err && user) {
                res.statusCode = 403;
                return res.send(user);
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
        });
    }
});

app.get('/bucket', function(req, res) {
    res.send('GET bucket');
});

app.post('/myorders', function(req, res) {
    res.send('POST ORDER');
});

app.get('/myorders', function(req, res) {
    res.send('GET orders');
});

app.get('/wines/:id', function(req, res) {
    return WineModel.findById(req.params.id, function (err, wine) {
        if(!wine) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            return res.send({ status: 'OK', wine: wine });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

app.put('/wines/:id', function (req, res){
    return WineModel.findById(req.params.id, function (err, wine) {
        if(!wine) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        wine.name = req.body.name;
        wine.description.country = req.body.description.country;
        wine.description.year = req.body.description.year;
        wine.description.type = req.body.description.type;
        wine.description.desc = req.body.description.desc;
        wine.images = new ImageModel({imgurl: req.body.images});
        return wine.save(function (err) {
            if (!err) {
                log.info("article updated");
                return res.send({ status: 'OK', wine: wine });
            } else {
                if(err.name === 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });
});

app.delete('/wines/:id', function (req, res){
    return WineModel.findById(req.params.id, function (err, wine) {
        if(!wine) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return wine.remove(function (err) {
            if (!err) {
                log.info("article removed");
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });
});

app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
});

app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
});

app.get('/ErrorExample', function(req, res, next){
    next(new Error('Random error!'));
});

