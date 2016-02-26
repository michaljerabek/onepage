var express = require("express");
var router = express.Router();

var Page = require("./../../models/Page");

require("ractive-require-templates")(".tpl");
var Ractive = require("ractive");


var isAuthenticated = function (req, res, next) {
    console.log(req.isAuthenticated());
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
            pages: pages
        };

        var App = require("./../../../client/admin.js")(data);

        res.render("index", {
            title: "Admin: " + data.user,
            ractiveHtml: App.toHtml(),
            ractiveData: JSON.stringify(data),
            env: "dev",
            isAdmin: true
        });

    });

});

module.exports = router;
