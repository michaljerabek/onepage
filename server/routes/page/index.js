var express = require("express");
var router = express.Router();

require("ractive-require-templates")(".tpl");
var Ractive = require("ractive");

/* GET home page. */
router.get("/", function (req, res, next) {

    var data = {
        page: {
            name: req.Page.name,
            sections: req.Page.sections
        }
    };

    var App = require("./../../../client/page.js")(data);

    res.render("index", {
        title: req.Page.name,
        ractiveHtml: App.toHtml(),
        ractiveData: JSON.stringify(data),
        env: "dev"
    });
});

module.exports = router;
