var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var UserModel = require("./../models/User");
var Page = require("./../models/Page");

//?name=n&databaseName=n
router.get("/createTestData", function (req, res, next) {

    var User = UserModel(req.db);

    User.findOne({name: req.query.name}, function (err, user) {

        if (!user) {

            user = new User({
                name: req.query.name,
                databaseName: req.query.databaseName,
                hostnames: [ req.headers.host.split(":").shift() ]
            });

        } else {

            user.hostnames.push(req.headers.host.split(":").shift());
        }

        user.save(function () {

            var userDb = mongoose.createConnection("mongodb://localhost/" + user.databaseName);

            var page = Page(userDb)({
                name: "User: " + user.name + "; Web: " + req.headers.host.split(":").shift(),
                hostnames: [ req.headers.host.split(":").shift() ]
            });

            page.save(function () {
                res.json(arguments);
            });
        });

    });

});

module.exports = router;
