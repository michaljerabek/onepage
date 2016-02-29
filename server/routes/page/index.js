/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var express = require("express");
var router = express.Router();


require("ractive-require-templates")(".tpl");
var Ractive = require("ractive");

router.get("/", function (req, res, next) {

    var data = {
        databaseName: req.userDb.name,
        page: {
            _id: req.Page._id,
            name: req.Page.name,
            sections: req.Page.sections,
            isAdmin: req.query.admin !== undefined ? "development" : false
        }
    };

    var App = require("./../../../client/Page.js")({
        data: data
    });

    res.render("index", {
        title: req.Page.name,
        ractiveHtml: App.toHtml(),
        ractiveData: JSON.stringify(data),
        env: "dev"
    });
});

module.exports = router;
