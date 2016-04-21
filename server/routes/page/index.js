/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var express = require("express");
var router = express.Router();
var fse = require("fs-extra");
var imagemagick = require("imagemagick");
var gm = require("gm");
var path = require("path");

require("ractive-require-templates")(".tpl");
var Ractive = require("ractive"),

    multer = require("multer"),

    storage = multer.diskStorage({
        destination: function (req, file, cb) {

            var path = "public/uploads/users/" + (req.userId || req.user._id) + "/images";

            fse.stat(path, function (err) {

                if (err) {

                    fse.mkdirs(path + "/thumbs", function (err) {

                        if (!err) {

                            cb(null, path);
                        }
                    });

                    return;
                }

                cb(null, path);
            });

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
        env: "dev"
    });
});


//router.post("/upload-background-images", upload.array("background-images"), function (req, res) {
router.post("/upload-background-images", upload.any(), function (req, res) {

    var f = req.files.length - 1,

        files = [];

    for (f; f >= 0; f--) {

        gm(req.files[f].path)
            .resize(100, 100)
            .quality(65)
            .noProfile()
            .write(path.join(req.files[f].destination, "thumbs", req.files[f].filename), function () {});

        files.push({
            originalname: req.files[f].originalname,
            name: req.files[f].filename,
            path: req.files[f].path
        });
    }

    res.json({
        files: files
    });

});

router.post("/upload-background-image", upload.single("background-image"), function (req, res) {

    gm(req.file.path)
        .resize(100, 100)
        .quality(65)
        .noProfile()
        .write(path.join(req.file.destination, "thumbs", req.file.filename), function () {});

    res.json({
        path: req.file.path,
        name: req.file.filename
    });

});


module.exports = router;
