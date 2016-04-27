/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var config = require("./../../../config");

var fse = require("fs-extra");
var path = require("path");
var mime = require("mime");

var gm = require("gm");

var multer = require("multer"),

    storageImages = multer.diskStorage({

        destination: function (req, file, cb) {

            var path = "public/" + config.upload.images.path.replace("{{userId}}", req.userId || req.user._id);

            fse.stat(path, function (err) {

                if (err) {

                    fse.mkdirs(path + config.upload.images.thumbRelPath, function (err) {

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

    multerUploadImages = multer({
        storage: storageImages
    });

var ImageReq = (function() {

    var userId = null,

        processAndSendImages = function (files, directoryPath, response, req, res) {

            if (!files.length) {

                return res(response);
            }

            var currentFilename = files.shift(),

                filePath = path.join(directoryPath, currentFilename);

            fse.stat(filePath, function (err, stat) {

                if (!err && stat.isFile()) {

                    var mimeType = mime.lookup(filePath);

                    if (mimeType.match(/image/)) {

                        var thumbPath = path.join(directoryPath, config.upload.images.thumbRelPath, currentFilename);

                        fse.stat(thumbPath, function (err) {

                            //pokud soubor nemá thumb, byl pravděpodobně špatně nahrán -> smazat
                            if (err) {

                                if (!directoryPath.match(new RegExp("^" + config.library.path))) {

                                    fse.unlink(filePath, function () {});
                                }

                                processAndSendImages(files, directoryPath, response, req, res);

                                return;
                            }

                            gm(filePath).size(function (err, size) {

                                response.files.unshift({
                                    name: currentFilename,
                                    path: path.join(req.params.directory, currentFilename),
                                    directory: req.params.directory,
                                    width: err ? null : size.width,
                                    height: err ? null : size.height
                                });

                                processAndSendImages(files, directoryPath, response, req, res);
                            });
                        });

                        return;
                    }

                    processAndSendImages(files, directoryPath, response, req, res);

                    return;
                }

                processAndSendImages(files, directoryPath, response, req, res);
            });
        },

        findImagesDirs = function (req, res) {

            var directories = [],

                libraryPath = path.resolve("public/" + config.library.images.path);

            directories.push({
                name: config.upload.images.name,
                path: config.upload.images.path.replace("{{userId}}", userId),
                deletable: true,
                uploadable: true
            });

            fse.readdir(libraryPath, function (err, data) {

                if (err || !data) {

                    return res({
                        directories: directories
                    });
                }

                var d = 0, stat;

                for (d; d < data.length; d++) {

                    stat = fse.statSync(path.join(libraryPath, data[d]));

                    if (stat.isDirectory()) {

                        directories.push({
                            name: data[d],
                            path: path.join(config.library.images.path, data[d])
                        });
                    }
                }

                res({
                    directories: directories
                });
            });
        },

        findImages = function (req, res) {

            var directoryPath = path.resolve("public/" + req.params.directory),

                response = {
                    files: []
                };

            fse.readdir(directoryPath, function (err, data) {

                if (err || !data) {

                    res(response);

                    return;
                }

                processAndSendImages(data, directoryPath, response, req, res);
            });
        },

        deleteImage = function (req) {

            var parsed = path.parse(req.params.path),

                filePath = path.resolve("public/" + req.params.path),
                thumbPath = path.resolve(path.join("public", parsed.dir, config.upload.images.thumbRelPath, parsed.base));

            fse.unlink(filePath, function () {});
            fse.unlink(thumbPath, function () {});
        },

        createThumbnail = function (file) {

            gm(file.path)
                .resize(config.upload.images.thumbWidth, config.upload.images.thumbHeight)
                .quality(config.upload.images.thumbQuality)
                .noProfile()
                .write(path.join(file.destination, config.upload.images.thumbRelPath, file.filename), function () {});
        },

        uploadImage = function (req, res) {

            createThumbnail(req.file);

            res.json({
                originalname: req.file.originalname,
                path: req.file.path,
                name: req.file.filename
            });
        },

        uploadImages = function (req, res) {

            var f = req.files.length - 1,

                files = [];

            for (f; f >= 0; f--) {

                createThumbnail(req.files[f]);

                files.push({
                    originalname: req.files[f].originalname,
                    name: req.files[f].filename,
                    path: req.files[f].path
                });
            }

            res.json({
                files: files
            });
        },

        registerWSComm = function (req, _userId) {

            userId = _userId;

            req("images.dirs", findImagesDirs);
            req("images", findImages);
            req("images.delete", deleteImage);
        },

        registerRoutes = function (router) {

            router.post("/upload-image", multerUploadImages.single("image"), uploadImage);
            router.post("/upload-images", multerUploadImages.any(), uploadImages);
        };

    return {
        registerWSComm: registerWSComm,
        registerRoutes: registerRoutes
    };

}());

module.exports = ImageReq;
