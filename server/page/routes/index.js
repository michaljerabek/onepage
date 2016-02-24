var express = require("express");
var router = express.Router();

require("ractive-require-templates")(".tpl");
var Ractive = require("ractive");

/* GET home page. */
router.get("/", function (req, res, next) {

    var data = {
        test: "test",
        num: 1
    };

    var App = require("./../../../client/page.js")(data);

    res.render("index", {
        title: "onepage",
        ractiveHtml: App.toHtml(),
        ractiveData: JSON.stringify(data),
        env: "dev"
    });
});

module.exports = router;
