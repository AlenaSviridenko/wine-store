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
var OrderModel = dbModels.OrderModel;

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
app.use(session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true
}));

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('../client'));

app.listen(config.port, function () {
    console.log('Running on port ' + config.port)
});

app.post('/login', function(req, res) {
    return UserModel.findOne({username: req.body.username}, function(err, user) {
        if (!err && user) {
            if (verifyPassword(req.body.password, user.password)) {
                req.session.user = user;
                return res.send({user:user, sid: req.sessionID});
            }
            res.statusCode = 404;
            log.error('Username/password are not matched');
            return res.send({ error: 'Username/password are not matched' });
        }
        res.statusCode = 404;
        log.error('User not found');
        return res.send({ error: 'User not found' });
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
    var user = new UserModel({
        username: req.body.username,
        password: getHash(req.body.password),
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    user.save(function (err) {
        if (!err) {
            req.session.user = user;
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

app.put('/users/:id', function(req, res) {
    UserModel.findById(req.params.id, function(err, user) {
        if (!user) {
            res.statusCode = 404;
            return res.send({error: 'Not updated, user not found'})
        }

        if (user) {
            user.address = user.address || {};

            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.phone = req.body.phone || '';
            user.street = req.body.street || '';
            user.zip = req.body.zip || '';
            user.city = req.body.city || '';
            user.country = req.body.country || '';

            user.save(user, function(err) {
                if (err) {
                    res.statusCode = 500;
                    return res.send({error: 'Internal error while saving'})
                }
                res.statusCode = 200;
                return res.send({status: 'OK', user: user});
            })

        }
    });
});

app.get('/users', function(req, res) {
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

app.post('/logout', function(req, res) {
    req.session.destroy();
    res.writeHead(200);
    res.end();
});

app.post('/orders', function(req, res) {
    var order = new OrderModel({
        userId: req.body.userId,
        totalSum: req.body.totalSum,
        items: req.body.items
    });

    order.save(function (err) {
        if (!err) {

            var promises = req.body.items.map(function(item) {
                return new Promise(function(resolve, reject) {
                    WineModel.findById(item.itemId, function(err, product) {

                        if (err) {
                            return reject(err);
                        }

                        var newQuantity = product.toJSON().availableQuantity - item.quantity;
                        product.set({availableQuantity: newQuantity});

                        product.save(function(err) {
                            if (err) {
                                return reject(err);
                            }

                            resolve();
                        });
                    })
                }(item))
            });

            Promise.all(promises)
                .then(function() {
                    return res.send({ statusCode: 200, msg: 'Order Saved!' });
                }, function () {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                });

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

