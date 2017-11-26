var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var async = require('async');
var bcrypt = require('bcrypt');
var log = require('./utils/log')(module);
var config = require('./config.json');

var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();

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

var Errors = {
    Validation: 'ValidationError',
    Server: 'Server Error',
    Internal: 'Internal Error',
    UserNotFound: 'User not found',
    WrongPassword: 'Username/password are not matched',
    UpdateItem: 'Quantity update failed',
    NotFoundItems: 'Not all item found in database',
    NotFoundUrl: 'Not found URL',
    Forbidden: 'Access Forbidden'
};

app.set('port', config.port);
app.use(logger('dev'));
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
            var details = {
                code: 404,
                error: Errors.WrongPassword
            };
            errorHandler(res, req, details);
        }
        var details = {
            code: 404,
            error: Errors.UserNotFound
        };
        errorHandler(res, req, details);
    });
});

app.get('/wines', function(req, res) {
    return WineModel.find(req.query, function (err, articles) {
        if (!err) {
            return res.send(articles);
        } else {
            var details = {
                code: 500,
                error: Errors.Server
            };
            errorHandler(res, req, details, err);
        }
    });
});

app.post('/wines', function(req, res) {
    if (!req.session.user) {
        var details = {
            code: 403,
            error: Errors.Forbidden
        };
        errorHandler(res, req, details);
    }

    var wine = new WineModel({
        name: req.body.name,
        country: req.body.country,
        year: req.body.year,
        type: req.body.type,
        desc: req.body.desc,
        price: req.body.price,
        availableQuantity: req.body.availableQuantity,
        image: new ImageModel({imgurl: req.body.image})
    });

    wine.save(function (err) {
        if (!err) {
            log.info('Wine saved!');
            return res.send({ status: 'OK', wine: wine });
        } else {
            var details = {
                code: 0,
                error: ''
            };
            if(err.name === Errors.Validation) {
                details.code = 400;
                details.error = Errors.Validation;
                errorHandler(res, req, details, err);
            } else {
                details.code = 500;
                details.error = Errors.Server;
                errorHandler(res, req, details, err);
            }
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
            var details = {
                code: 0,
                error: ''
            };
            if(err.name === Errors.Validation) {
                details.code = 400;
                details.error = Errors.Validation;
                errorHandler(res, req, details, err);
            } else {
                details.code = 500;
                details.error = Errors.Server;
                errorHandler(res, req, details, err);
            }
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
                var details = {
                    code: 500,
                    error: Errors.Server
                };
                errorHandler(res, req, details, err);
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
    if (!req.session.user) {
        var details = {
            code: 403,
            error: Errors.Forbidden
        };
        errorHandler(res, req, details);
    }

    var order = new OrderModel({
        userId: req.body.userId,
        totalSum: req.body.totalSum,
        items: req.body.items
    });

    order.save(function (err) {
        if (!err) {
            var arrayOfIds = {
                $in: []
            };

            req.body.items.forEach(function(item){
                arrayOfIds.$in.push(mongoose.Types.ObjectId(item.itemId));
            });

            var promise =  WineModel.find({'_id': arrayOfIds}).exec();
            promise.then(function(result) {

                var promises = [];
                req.body.items.forEach(function(item) {
                    var model = result.filter(function(res) {
                        res = res.toJSON();
                        return res._id.equals(mongoose.Types.ObjectId(item.itemId));
                    })[0];

                    var newQuantity = model.toJSON().availableQuantity - item.quantity;
                    model.set({availableQuantity: newQuantity});

                    promises.push(model.save());
                });

                Promise.all(promises)
                    .then(function(result) {
                        res.statusCode = 200;
                        return res.send({status: 'OK', message: 'Order Saved!'});
                    },function(err) {
                        var details = {
                            code: 400,
                            error: Errors.UpdateItem
                        };
                        errorHandler(res, req, details);
                    });
            }, function(err) {
                var details = {
                    code: 400,
                    error: Errors.NotFoundItems
                };
                errorHandler(res, req, details);
            });
        } else {
            var details = {
                code: 0,
                error: ''
            };
            if(err.name === Errors.Validation) {
                details.code = 400;
                details.error = Errors.Validation;
                errorHandler(res, req, details, err);
            } else {
                details.code = 500;
                details.error = Errors.Server;
                errorHandler(res, req, details, err);
            }
        }
    });
});

app.get('/orders', function(req, res) {
    if (!req.session.user) {
        var details = {
            code: 403,
            error: Errors.Forbidden
        };
        errorHandler(res, req, details);
    }

    var query = req.query;
    return OrderModel.find(query, function(err, orders) {
        var asyncOperations = [];
        orders.forEach(function(order) {
            asyncOperations.push(function(callback) {
                var orderItems = order.toJSON().items;
                var ids = {
                    $in: []
                };

                orderItems.forEach(function(item) {
                    ids.$in.push(mongoose.Types.ObjectId(item.itemId));
                });

                var promise = WineModel.find({_id: ids}).exec();

                promise.then(function(result) {
                    orderItems.forEach(function(item) {
                        var details = result.filter(function(res) {
                            res = res.toJSON();
                            return res._id.equals(mongoose.Types.ObjectId(item.itemId));
                        })[0];

                        item.details = details.toJSON();
                    });
                    order.set({items: orderItems});
                    callback(null, order);
                }, function(err) {
                    callback(err, null);
                });
            });
        });

        async.parallel(asyncOperations, function(error, result){
            if (!error) {
                return res.send(result);
            } else {
                var details = {
                    code: 400,
                    error: Errors.NotFoundItems
                };
                errorHandler(res, req, details, err);
            }
        })

    })
});

// unknown road
app.use(function(req, res, next){
    var details = {
        code: 404,
        error: Errors.NotFoundUrl
    };
    errorHandler(res, req, details);
});

app.use(function(err, req, res) {
    var details = {
        code: 500,
        error: Errors.Internal
    };
    errorHandler(res, req, details, err);
});

var errorHandler = function (res, req, details, err) {
    res.statusCode = details.code;
    var codeError = err ? err.message : '';
    log.error(details.error + '(%d): %s', res.statusCode, codeError);
    return res.send({ error: details.error });
}

