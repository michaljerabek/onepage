var express = require("express");
var router = express.Router();

var Page = require("./../../models/Page");

require("ractive-require-templates")(".tpl");
var Ractive = require("ractive");


var isAuthenticated = function (req, res, next) {

    if (req.isAuthenticated()) {

        return next();
    }

    res.redirect("users/login");
};

router.get("/", isAuthenticated, function (req, res, next) {

    Page(req.userDb).find({}, "name", function (err, pages) {

        var data = {
            user: req.user.name,
            databaseName: req.user.databaseName,
            userId: req.user._id,
            pages: pages
        };

        var App = require("./../../../client/Admin.js")({
            data: data
        });

        res.render("index", {
            title: "Admin: " + data.user,
            ractiveHtml: App.toHTML(),
            ractiveCss: App.toCSS(),
            ractiveData: JSON.stringify(data),
            env: "dev",
            isAdmin: true
        });

    });

});

module.exports = router;
