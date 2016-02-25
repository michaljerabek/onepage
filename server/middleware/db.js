var mongoose = require("mongoose");
var User = require("./../models/User");
var Page = require("./../models/Page");

var useUserDbForAdmin = function (req, res, next, db, config) {

    req.db = db;

    User(db).findByDatabaseName(req.query.databaseName, function (err, user) {

        if (user) {

            req.user = user;
            req.userDb = mongoose.createConnection("mongodb://" + config.DB.users.host + "/" + user.databaseName);
        }

        next(err);
    });
};

var useUserDbForPage = function (req, res, next, db, config) {

    req.db = db;

    User(db).findByHost(req.hostname, function (err, user) {

        if (user) {

            req.user = user;
            req.userDb = mongoose.createConnection("mongodb://" + config.DB.global.host + "/" + user.databaseName);

            Page(req.userDb).findByHost(req.hostname, function (err, page) {

                req.Page = page;

                next(err);
            });

            return;
        }

        next(err);
    });
};

module.exports = {

    start: function (config) {

        var db = mongoose.createConnection("mongodb://" + config.DB.global.host + "/" + config.DB.global.name);

        return function (req, res, next) {

            if (req.hostname === config.appHostname) {

                if (req.path.match(/^\/admin/)) {

                    return useUserDbForAdmin(req, res, next, db, config);
                }

                return next();
            }

            useUserDbForPage(req, res, next, db, config);
        };
    },

    end: function () {

        return function (req, res, next) {

            if (req.userDb) {

                res.on("finish", function () {
                    req.userDb.close();
                });

                res.on("close", function () {
                    req.userDb.close();
                });
            }

            next();
        };

    }
};

