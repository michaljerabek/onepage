/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var config = require("./../../../config");
var PublicPath = require("./../../../helpers/PublicPath");

var fse = require("fs-extra");
var path = require("path");
var mime = require("mime");
var getFolderSize = require("get-folder-size");

var Icon = require("./../../models/Icon");

var gm = require("gm");
var document = require("jsdom").jsdom();
var DOMPurify = require("dompurify")(document.defaultView);

var multer = require("multer"),

    storageIcons = multer.diskStorage({

        destination: function (req, file, cb) {

            var path = "public/" + config.upload.icons.path.replace("{{userId}}", req.userId || req.user._id),
                storagePath = "public/" + config.upload.storagePath.replace("{{userId}}", req.userId || req.user._id);

            getFolderSize(storagePath, function (err, size) {

                if (err) {

                    return cb(err, path);
                }

                req.storageSize = size;

                fse.stat(path, function (err) {

                    if (err) {

                        fse.mkdirs(path + config.upload.icons.thumbRelPath, function (err) {

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

    multerUploadIcons = multer({
        storage: storageIcons
    });

var IconReq = (function() {

    var userId = null,

        createThumbnail = function (file) {

            gm(file.path)
                .resize(config.upload.icons.thumbWidth, config.upload.icons.thumbHeight)
                .quality(config.upload.icons.thumbQuality)
                .noProfile()
                .write(path.join(file.destination, config.upload.icons.thumbRelPath, file.filename), function () {});
        },

        processAndSendIconsFindReq = function (files, directoryPath, response, req, res) {

            if (!files.length) {

                return res(response);
            }

            var currentFilename = files.shift(),

                filePath = path.join(directoryPath, currentFilename);

            fse.stat(filePath, function (err, stat) {

                if (!err && stat.isFile()) {

                    var mimeType = mime.lookup(filePath);

                    if (mimeType.match(/image/)) {

                        //soubor je typu svg
                        if (mimeType.match(/svg|xml/)) {

                            fse.readFile(filePath, function (err, buffer) {

                                if (!err) {

                                    var content = buffer.toString(),

                                        purified = DOMPurify.sanitize(content);

                                    response.files.unshift({
                                        name: currentFilename,
                                        path: PublicPath.from(path.join(req.params.directory, currentFilename)),
                                        directory: req.params.directory,
                                        svg: purified
                                    });
                                }

                                processAndSendIconsFindReq(files, directoryPath, response, req, res);
                            });

                            return;
                        }

                        //soubor je typu png
                        var thumbPath = path.join(directoryPath, config.upload.icons.thumbRelPath, currentFilename);

                        fse.stat(thumbPath, function (err) {

                            //pokud nemá soubor thumbnail, byl pravděpodobně špatně nahrán -> delete
                            if (err) {

                                if (!directoryPath.match(new RegExp("^" + config.library.path))) {

                                    fse.unlink(filePath, function () {});
                                }

                                processAndSendIconsFindReq(files, directoryPath, response, req, res);

                                return;
                            }

                            gm(filePath).size(function (error, size) {

                                response.files.unshift({
                                    name: currentFilename,
                                    path: PublicPath.from(path.join(req.params.directory, currentFilename)),
                                    directory: req.params.directory,
                                    width: error ? null : size.width,
                                    height: error ? null : size.height
                                });

                                processAndSendIconsFindReq(files, directoryPath, response, req, res);
                            });
                        });

                        return;
                    }

                    processAndSendIconsFindReq(files, directoryPath, response, req, res);

                    return;
                }

                processAndSendIconsFindReq(files, directoryPath, response, req, res);
            });
        },

        processAndSendIconsUploadReq = function (files, MAX_STORAGE, req, res) {

            if (!req.files.length) {

                return res.json({
                    files: files,
                    MAX_STORAGE: MAX_STORAGE
                });
            }

            var currentFile = req.files.shift(),

                mimeType = mime.lookup(currentFile.path);

            req.storageSize += currentFile.size;

            if (req.storageSize > config.upload.storageSize) {

                fse.unlink(currentFile.path, function () {});

                MAX_STORAGE.push({
                    originalname: currentFile.originalname
                });

                return processAndSendIconsUploadReq(files, MAX_STORAGE, req, res);
            }

            //nahraný soubor je typu svg
            if (mimeType.match(/svg|xml/)) {

                fse.readFile(currentFile.path, function (err, buffer) {

                    if (err) {

                        return processAndSendIconsUploadReq(files, MAX_STORAGE, req, res);
                    }

                    var content = buffer.toString(),

                        purified = DOMPurify.sanitize(content);

                    fse.writeFile(currentFile.path, purified, function (err) {

                        if (!err) {

                            files.push({
                                originalname: currentFile.originalname,
                                name: currentFile.filename,
                                path: PublicPath.from(currentFile.path),
                                svg: purified
                            });

                        } else {

                            fse.unlink(currentFile.path, function () {});
                        }

                        processAndSendIconsUploadReq(files, MAX_STORAGE, req, res);
                    });
                });

                return;
            }

            //nahraný soubor je typu png
            createThumbnail(currentFile);

            files.push({
                originalname: currentFile.originalname,
                name: currentFile.filename,
                path: PublicPath.from(currentFile.path)
            });

            processAndSendIconsUploadReq(files, MAX_STORAGE, req, res);
        },

        findIconsDirs = function (req, res) {

            var directories = [];

            directories.push({
                name: config.upload.icons.name,
                path: config.upload.icons.path.replace("{{userId}}", userId),
                deletable: true,
                uploadable: true
            });

            //katagorie v DB === složky
            Icon.getCategories(function (err, categories) {

                if (!err && categories) {

                    categories.sort();

                    var c = 0;

                    for (c; c < categories.length; c++) {

                        directories.push({
                            name: categories[c],
                            path: config.library.icons.path + categories[c]
                        });
                    }
                }

                res({
                    directories: directories
                });
            });
        },

        findIcons = function (req, res) {

            var response = {
                files: []
            };

            if (req.params.directory.match(new RegExp("^" + config.library.icons.path))) {

                Icon.findByCategory(req.params.directory.replace(config.library.icons.path, ""), function (err, icons) {

                    if (!err && icons) {

                        var i = icons.length - 1;

                        for (i; i >= 0; i--) {

                            response.files.push({
                                name: icons[i].name,
                                directory: icons[i].category,
                                path: config.library.icons.path + icons[i].category,
                                svg: icons[i].data
                            });
                        }
                    }

                    res(response);
                });

                return;
            }

            var directoryPath = path.resolve("public/" + req.params.directory);

            fse.readdir(directoryPath, function (err, data) {

                if (err || !data) {

                    res(response);

                    return;
                }

                processAndSendIconsFindReq(data, directoryPath, response, req, res);
            });
        },

        deleteIcon = function (req) {

            var parsed = path.parse(req.params.path),

                filePath = path.resolve("public" + req.params.path),
                thumbPath = path.resolve(path.join("public", parsed.dir, config.upload.icons.thumbRelPath, parsed.base));

            fse.unlink(filePath, function () {});

            //pokud je soubor .png -> smazat i thumb
            if (!mime.lookup(filePath).match(/svg|xml/)) {

                fse.unlink(thumbPath, function () {});
            }
        },

        uploadIcon = function (req, res) {

            var mimeType = mime.lookup(req.file.path);

            req.storageSize += req.file.size;

            if (req.storageSize > config.upload.storageSize) {

                fse.unlink(req.file.path, function () {});

                return res.status(500).send("MAX_STORAGE");
            }

            //nahraný soubor je typu svg
            if (mimeType.match(/svg|xml/)) {

                fse.readFile(req.file.path, function (err, buffer) {

                    if (err) {

                        return res.status(500);
                    }

                    var content = buffer.toString(),

                        purified = DOMPurify.sanitize(content);

                    fse.writeFile(req.file.path, purified, function (err) {

                        if (err) {

                            fse.unlink(req.file.path, function () {});

                            return res.status(500);
                        }

                        return res.json({
                            originalname: req.file.originalname,
                            name: req.file.filename,
                            path: PublicPath.from(req.file.path),
                            svg: purified
                        });
                    });
                });

                return;
            }

            //nahraný soubor je typu png
            createThumbnail(req.file);

            return res.json({
                originalname: req.file.originalname,
                name: req.file.filename,
                path: PublicPath.from(req.file.path)
            });
        },

        uploadIcons = function (req, res) {

            processAndSendIconsUploadReq([], [], req, res);
        },

        searchIcons = function (req, res) {

            Icon.userSearch(req.params.search, function (err, result) {

                var files = [];

                if (!err && result) {

                    var i = result.length - 1;

                    for (i; i >= 0; i--) {

                        files.push({
                            name: result[i].name,
                            directory: result[i].category,
                            path: config.library.icons.path + result[i].category,
                            svg: result[i].data
                        });
                    }
                }

                return res({
                    files: files
                });
            });
        },

        registerWSComm = function (req, _userId) {

            userId = _userId;

            req("icons.dirs", findIconsDirs);
            req("icons", findIcons);
            req("icons.search", searchIcons);
            req("icons.delete", deleteIcon);
        },

        registerRoutes = function (router) {

            router.post("/upload-icon", multerUploadIcons.single("icon"), uploadIcon);
            router.post("/upload-icons", multerUploadIcons.any(), uploadIcons);
        };

    return {
        registerWSComm: registerWSComm,
        registerRoutes: registerRoutes
    };

}());

module.exports = IconReq;
