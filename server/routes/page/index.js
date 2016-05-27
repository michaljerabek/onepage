/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var express = require("express");
var router = express.Router();

var ImageReq = require("./../../Page/ImageReq");
var IconReq = require("./../../Page/IconReq");

var appBuilder = require("./../../../client/Page.js");

require("ractive-require-templates")(".tpl");
//var Ractive = require("ractive");

router.get(/^\/?(js|css|img){0,0}[a-zA-Z]{0,2}\/?$/, function (req, res) {

    var data = {
        userId: req.userId || req.user._id,
        databaseName: req.userDb.name,
        page: {
            _id: req.Page._id,
            name: req.Page.name,
            sections: req.Page.sections,
            settings: req.Page.settings,
            hostnames: req.Page.hostnames,
            editMode: req.query.editMode !== undefined,
            lang: req.pageLang || req.Page.settings.lang.defaultLang || Object.keys(req.Page.settings.lang.langs)[0] || "cs"
        }
    };

    var App = appBuilder({
        data: data
    });

    return res.render("index", {
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
