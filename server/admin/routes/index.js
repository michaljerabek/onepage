var express = require("express");
var router = express.Router();

require("ractive-require-templates")(".tpl");
var Ractive = require("ractive");

router.get("/", function (req, res, next) {
    var data = {
        test: "test",
        num: 1
    };

    var App = require("./../../../client/admin.js")(data);

    res.render("index", {
        title: "onepage - Admin",
        ractiveHtml: App.toHtml(),
        ractiveData: JSON.stringify(data),
        env: "dev",
        isAdmin: true
    });

});

module.exports = router;
