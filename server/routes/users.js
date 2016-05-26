/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var User = require("./../models/User");
var Page = require("./../models/Page");

var bcrypt = require("bcrypt-nodejs");
var passport = require("passport");
var authenticate = passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/users/login"
});

router.get("/login", function (req, res, next) {

    res.render("login/index", {
        title: "Přihlášení do systému",
        message: req.flash("message")
    });
});

router.post("/login", authenticate, function (req, res, next) {

    res.send("registrace");
});

router.get("/logout", function (req, res, next) {

    req.logout();

    req.flash("message", "Byli jste odhlášeni.");

    res.redirect("/users/login");
});

//?name=n&databaseName=n?host
router.get("/createTestData", function (req, res, next) {

    User.findOne({name: req.query.name}, function (err, user) {

        if (!user) {

            user = new User({
                name: req.query.name,
                email: req.query.name + "@" + req.query.name + ".cz",
                databaseName: req.query.databaseName,
                password: bcrypt.hashSync(req.query.databaseName, bcrypt.genSaltSync(10), null),
                hostnames: [ req.query.host || req.headers.host.split(":").shift() ]
            });

        } else {

            user.hostnames.push(req.query.host || req.headers.host.split(":").shift());
        }

        user.save(function () {

            var userDb = mongoose.createConnection("mongodb://localhost/" + user.databaseName);

            var page = Page(userDb)({
                name: "User: " + user.name + "; Web: " + req.query.host || req.headers.host.split(":").shift(),
                hostnames: [ req.query.host || req.headers.host.split(":").shift() ]
            });

            page.save(function () {
                res.json(arguments);
            });
        });

    });

});

module.exports = router;
