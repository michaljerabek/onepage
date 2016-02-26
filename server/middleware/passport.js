/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("./../models/User");

var localStrategyConfig = {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback : true
};

var authenticateUser = function(req, email, password, done) {

    User.findByEmail(email, function (err, user) {

        if (err) {

            return done(err);
        }

        if (!user) {

            req.flash("message", "Kombinace se neshoduje.");

            return done(null, false);
        }

        if (!user.checkPassword(password)) {

            req.flash("message", "Kombinace se neshoduje.");

            return done(null, false);
        }

        req.user = user;

        return done(null, user);
    });
};

module.exports = function (app) {

    passport.use(new LocalStrategy(localStrategyConfig, authenticateUser));

    passport.serializeUser(function(user, done) {

        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {

        User.findById(id, function(err, user) {

            done(err, user);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());
};
