/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var express = require("express");
var router = express.Router();

var ImageReq = require("./../../Page/ImageReq");
var IconReq = require("./../../Page/IconReq");

require("ractive-require-templates")(".tpl");
//var Ractive = require("ractive");

router.get("/", function (req, res) {

    var data = {
        userId: req.userId || req.user._id,
        databaseName: req.userDb.name,
        page: {
            _id: req.Page._id,
            name: req.Page.name,
            sections: req.Page.sections,
            settings: req.Page.settings,
            editMode: req.query.editMode !== undefined
        }
    };

    var App = require("./../../../client/Page.js")({
        data: data
    });

    res.render("index", {
        title: req.Page.name,
        ractiveHtml: App.toHTML(),
        ractiveCss: App.toCSS(),
        ractiveData: JSON.stringify(data),
        env: "dev",
        editMode: req.query.editMode !== undefined
    });
});

router.get("/create-icon", function (req, res) {

    res.render("create-icon", {state: ""});
});

var Icon = require("./../../models/Icon");

router.post("/create-icon", function (req, res) {

    var icon = new Icon({
        name: req.body.name,
        category: req.body.category,
        data: req.body.data,
        tags: req.body.tags.trim()
            .replace(/\s*,\s*/g, ",")
            .split(",")
    });

    icon.save(function (err) {

        res.render("create-icon", {state: err ? "err" : "ok"});
    });

});

ImageReq.registerRoutes(router);
IconReq.registerRoutes(router);

module.exports = router;
