/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var config = require("./../../config");
var mongoose = require("mongoose");
var User = require("./../models/User");

var db = mongoose.connect("mongodb://" + config.Db.global.host + "/" + config.Db.global.name);

var assignUserDbForAdmin = function (req, res, next) {

    if (req.user) {

        req.userDb = mongoose.createConnection(
            "mongodb://" + config.Db.users.host + "/" + req.user.databaseName
        );

        return next();
    }

    next();
};

var assignUserDbForPage = function (req, res, next) {

    User.findByHost(req.hostname, function (err, user) {

        if (user) {

            req.defaultPage = user.defaultPage ? user.defaultPage[req.hostname.replace(/\./g, "_")] : null;

            req.requestForPage = true;

            req.userDb = mongoose.createConnection(
                "mongodb://" + config.Db.users.host + "/" + user.databaseName
            );

            req.userId = user._id;

            return next();
        }

        var error = new Error("Not Found");
        error.status = 404;

        next(error);
    });
};

module.exports = {

    reqStart: function (req, res, next) {

        req.db = db;

        if (req.hostname === config.appHostname) {

            if (req.path.match(/^\/admin/)) {

                return assignUserDbForAdmin(req, res, next);
            }

            return next();
        }

        assignUserDbForPage(req, res, next);
    },

    resEnd: function (req, res, next) {

        if (req.userDb) {

            res.on("finish", function () {
                req.userDb.close();
            });

            res.on("close", function () {
                req.userDb.close();
            });
        }

        next();
    }
};

