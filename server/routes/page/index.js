/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var express = require("express");
var router = express.Router();
var fse = require("fs-extra");
var imagemagick = require("imagemagick");
var path = require("path");
var gm = require("gm");
var mime = require("mime");
var document = require("jsdom").jsdom();
var DOMPurify = require("dompurify")(document.defaultView);

var Icon = require("./../../models/Icon");

require("ractive-require-templates")(".tpl");
var Ractive = require("ractive"),

    multer = require("multer"),

    storageImages = multer.diskStorage({
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

    storageIcons = multer.diskStorage({
        destination: function (req, file, cb) {

            var path = "public/uploads/users/" + (req.userId || req.user._id) + "/icons";

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

    uploadImages = multer({
        storage: storageImages
    }),

    uploadIcons = multer({
        storage: storageIcons
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
router.post("/upload-background-images", uploadImages.any(), function (req, res) {

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

router.post("/upload-background-image", uploadImages.single("background-image"), function (req, res) {

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

router.post("/upload-icons", uploadIcons.any(), function (req, res) {

    var f = req.files.length - 1,

        files = [];

    processAndSendIcons(files, req, res);

});

function processAndSendIcons(files, req, res) {

    if (!req.files.length) {

        return res.json({
            files: files
        });
    }

    var currentFile = req.files.shift(),

        mimeType = mime.lookup(currentFile.path);

    if (mimeType.match(/svg|xml/)) {

        fse.readFile(currentFile.path, function (err, buffer) {

            if (err) {

                return processAndSendIcons(files, req, res);
            }

            var content = buffer.toString(),

                purified = DOMPurify.sanitize(content);

            files.push({
                originalname: currentFile.originalname,
                name: currentFile.filename,
                path: currentFile.path,
                svg: purified
            });

            processAndSendIcons(files, req, res);
        });

        return;
    }

    gm(currentFile.path)
        .resize(40, 40)
        .quality(65)
        .noProfile()
        .write(path.join(currentFile.destination, "thumbs", currentFile.filename), function () {});

    files.push({
        originalname: currentFile.originalname,
        name: currentFile.filename,
        path: currentFile.path
    });

    processAndSendIcons(files, req, res);
}

router.post("/upload-icon", uploadIcons.single("icon"), function (req, res) {

});

router.get("/create-icon", function (req, res) {

    res.render("create-icon", {state: ""});
});

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

module.exports = router;
