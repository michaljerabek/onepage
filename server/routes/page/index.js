/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var express = require("express");
var router = express.Router();

require("ractive-require-templates")(".tpl");
var Ractive = require("ractive"),

    multer = require("multer"),
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public/uploads");
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        }
    }),

    upload = multer({
        storage: storage
    });

router.get("/", function (req, res, next) {

    var data = {
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
        env: "dev"
    });
});

router.post("/upload-background-image", upload.single("background-image"), function (req, res, next) {

    res.json({
        path: req.file.path
    });

});

module.exports = router;
