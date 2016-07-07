/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var config = require("./../../../config");
var PublicPath = require("./../../../helpers/PublicPath");

var fse = require("fs-extra");
var path = require("path");
var mime = require("mime");
var getFolderSize = require("get-folder-size");

var multer = require("multer"),

    storageFiles = multer.diskStorage({

        destination: function (req, file, cb) {

            var path = "public/" + config.upload.files.path.replace("{{userId}}", req.userId || req.user._id),
                storagePath = "public/" + config.upload.storagePath.replace("{{userId}}", req.userId || req.user._id);

            getFolderSize(storagePath, function (err, size) {

                if (err) {

                    cb(err, path);

                    return;
                }

                req.storageSize = size;

                fse.stat(path, function (err) {

                    if (err) {

                        fse.mkdirs(path, function (err) {

                            cb(err, path);
                        });

                        return;
                    }

                    cb(null, path);
                });
            });
        },

        filename: function (req, file, cb) {

            cb(null, Date.now() + "-" + file.originalname);
        }
    }),

    multerUploadFiles = multer({
        storage: storageFiles
    });

var FileReq = (function() {

    var userId = null,

        processAndSendFiles = function (files, directoryPath, response, req, res, relPath) {

            if (!files.length) {

                return res(response);
            }

            var currentFilename = files.shift(),

                filePath = path.join(directoryPath, currentFilename);

            fse.stat(filePath, function (err, stat) {

                if (!err && stat.isFile()) {

                    response.files.unshift({
                        name: currentFilename,
                        path: PublicPath.from(path.join(relPath, currentFilename)),
                        directory: PublicPath.from(relPath),
                        size: stat.size
                    });

                    processAndSendFiles(files, directoryPath, response, req, res, relPath);

                    return;
                }

                processAndSendFiles(files, directoryPath, response, req, res, relPath);
            });
        },

        findFiles = function (req, res) {

            var relPath = "/" + config.upload.files.path.replace("{{userId}}", userId),

                directoryPath = path.resolve("public" + relPath),

                response = {
                    files: []
                };

            fse.readdir(directoryPath, function (err, data) {

                if (err || !data) {

                    res(response);

                    return;
                }

                processAndSendFiles(data, directoryPath, response, req, res, relPath);
            });
        },

        deleteFile = function (req) {

            var filePath = path.resolve("public/" + req.params.path);

            fse.unlink(filePath, function () {});
        },

        uploadFile = function (req, res) {

            if (req.storageSize + req.file.size > config.upload.storageSize) {

                fse.unlink(req.file.path, function () {});

                return res.status(500).send("MAX_STORAGE");
            }

            res.json({
                originalname: req.file.originalname,
                path: PublicPath.from(req.file.path),
                name: req.file.filename
            });
        },

        uploadFiles = function (req, res) {

            var f = req.files.length - 1,

                files = [],

                MAX_STORAGE = [];

            for (f; f >= 0; f--) {

                req.storageSize += req.files[f].size;

                if (req.storageSize > config.upload.storageSize) {

                    fse.unlink(req.files[f].path, function () {});

                    MAX_STORAGE.push({
                        originalname: req.files[f].originalname
                    });

                } else {

                    files.push({
                        originalname: req.files[f].originalname,
                        name: req.files[f].filename,
                        path: PublicPath.from(req.files[f].path)
                    });
                }
            }

            res.json({
                files: files,
                MAX_STORAGE: MAX_STORAGE
            });
        },

        registerWSComm = function (req, _userId) {

            userId = _userId;

            req("files", findFiles);
            req("files.delete", deleteFile);
        },

        registerRoutes = function (router) {

            router.post("/upload-file", multerUploadFiles.single("file"), uploadFile);
            router.post("/upload-files", multerUploadFiles.any(), uploadFiles);
        };

    return {
        registerWSComm: registerWSComm,
        registerRoutes: registerRoutes
    };

}());

module.exports = FileReq;
