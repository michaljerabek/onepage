/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/

var config = require("./../../config");
var io = require("socket.io")(config.websocket.port);
var WSReq = require("./WSReq");
var mongoose = require("mongoose");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var gm = require("gm");
var Icon = require("./../models/Icon");

var getHostFromSocket = function (socket) {

    return socket.handshake.headers.host.split(":").shift();
};

var connectToDb = function (db, databaseName) {

    if (db) {

        return db.open("mongodb://" + config.Db.users.host + "/" + databaseName);
    }

    return mongoose.createConnection("mongodb://" + config.Db.users.host + "/" + databaseName);
};

io.on("connection", function (socket) {

    var db,
        databaseName,
        userId,
        dbTimeout;

    var dbConnectionTimeout = function () {

        if (db && !db.readyState) {

            connectToDb(db, databaseName);
        }

        clearTimeout(dbTimeout);

        dbTimeout = setTimeout(function () {

            if (db) {

                db.close();
            }
        }, config.websocket.dbTimeout);
    };

    var req = WSReq(socket, dbConnectionTimeout);

    socket.on("disconnect", function () {

        if (db) {

            db.close();
        }

        clearTimeout(dbTimeout);

        req = db = socket = null;
    });

    socket.on("databaseName", function (data) {

        databaseName = data.databaseName;
        userId = data.userId;
        db = connectToDb(db, databaseName);
        dbConnectionTimeout();

        socket.join(userId);

//        var adminRequests = require("./Admin");
        var pageRequests = require("./Page");

//        adminRequests(req, db, userId);
        pageRequests(req, db, userId);

        req("images.dirs", function (req, res) {

            var directories = [];

            directories.push({
                name: "Moje obrázky",
                path: "uploads/users/" + userId + "/images",
                deletable: true,
                uploadable: true
            });

            var libraryPath = path.resolve("public/library/background-images");

            fs.readdir(libraryPath, function (err, data) {

                if (err || !data) {

                    return res({
                        directories: directories
                    });
                }

                var libraryDirectories = [],

                    d = data.length - 1;

                for (d; d >= 0; d--) {

                    var stat = fs.statSync(path.join(libraryPath, data[d]));

                    if (stat.isDirectory()) {

                        libraryDirectories.unshift({
                            name: data[d],
                            path: path.join("library/background-images", data[d])
                        });
                    }
                }

                res({
                    directories: directories.concat(libraryDirectories)
                });
            });
        });

        function processAndSendImages(files, directoryPath, response, req, res) {

            if (!files.length) {

                return res(response);
            }

            var currentFilename = files.shift(),
                filePath = path.join(directoryPath, currentFilename);

            fs.stat(filePath, function (err, stat) {

                if (!err && stat.isFile()) {

                    var mimeType = mime.lookup(filePath);

                    if (mimeType.match(/image/)) {

                        var thumbPath = path.join(directoryPath, "thumbs", currentFilename);

                        fs.stat(thumbPath, function (err) {

                            if (err) {

                                if (!directoryPath.match(/^library/)) {

                                    fs.unlink(filePath, function () {});
                                }

                                processAndSendImages(files, directoryPath, response, req, res);

                                return;
                            }

                            gm(filePath).size(function (error, size) {

                                response.files.unshift({
                                    name: currentFilename,
                                    path: path.join(req.params.directory, currentFilename),
                                    directory: req.params.directory,
                                    width: error ? null : size.width,
                                    height: error ? null : size.height
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
        }

        req("images", function (req, res) {

            var directoryPath = path.resolve("public/" + req.params.directory),

                response = {
                    files: []
                };

            fs.readdir(directoryPath, function (err, data) {

                if (err || !data) {

                    res(response);

                    return;
                }

                processAndSendImages(data, directoryPath, response, req, res);
            });
        });

        req("images.delete", function (req) {

            var parsed = path.parse(req.params.path),

                filePath = path.resolve("public/" + req.params.path),
                thumbPath = path.resolve(path.join("public", parsed.dir, "/thumbs", parsed.base));

            fs.unlink(filePath, function () {});
            fs.unlink(thumbPath, function () {});
        });

        req("icons.dirs", function (req, res) {

            var directories = [];

            directories.push({
                name: "Moje ikony",
                path: "uploads/users/" + userId + "/icons",
                deletable: true,
                uploadable: true
            });

            var libraryPath = path.resolve("public/library/icons");

            fs.readdir(libraryPath, function (err, data) {

                if (err || !data) {

                    return res({
                        directories: directories
                    });
                }

                var libraryDirectories = [],

                    d = data.length - 1;

                for (d; d >= 0; d--) {

                    var stat = fs.statSync(path.join(libraryPath, data[d]));

                    if (stat.isDirectory()) {

                        libraryDirectories.unshift({
                            name: data[d],
                            path: path.join("library/icons", data[d])
                        });
                    }
                }

                res({
                    directories: directories.concat(libraryDirectories)
                });
            });
        });

        function processAndSendIcons(files, directoryPath, response, req, res) {

            if (!files.length) {

                return res(response);
            }

            var currentFilename = files.shift(),
                filePath = path.join(directoryPath, currentFilename);

            fs.stat(filePath, function (err, stat) {

                if (!err && stat.isFile()) {

                    var mimeType = mime.lookup(filePath);

                    if (mimeType.match(/image/)) {

                        if (mimeType.match(/svg|xml/)) {

                            fs.readFile(filePath, function (err, buffer) {

                                if (!err) {

                                    var content = buffer.toString(),

                                        svg = content.match(/<svg[\s\S]*<\/svg>/i);

                                    response.files.unshift({
                                        name: currentFilename,
                                        path: path.join(req.params.directory, currentFilename),
                                        directory: req.params.directory,
                                        svg: svg ? svg[0] : null
                                    });
                                }

                                processAndSendIcons(files, directoryPath, response, req, res);

                            });

                            return;
                        }

                        var thumbPath = path.join(directoryPath, "thumbs", currentFilename);

                        fs.stat(thumbPath, function (err) {

                            if (err) {

                                if (!directoryPath.match(/^library/)) {

                                    fs.unlink(filePath, function () {});
                                }

                                processAndSendIcons(files, directoryPath, response, req, res);

                                return;
                            }

                            gm(filePath).size(function (error, size) {

                                response.files.unshift({
                                    name: currentFilename,
                                    path: path.join(req.params.directory, currentFilename),
                                    directory: req.params.directory,
                                    width: error ? null : size.width,
                                    height: error ? null : size.height
                                });

                                processAndSendIcons(files, directoryPath, response, req, res);
                            });
                        });

                        return;
                    }

                    processAndSendIcons(files, directoryPath, response, req, res);

                    return;
                }

                processAndSendIcons(files, directoryPath, response, req, res);
            });
        }

        req("icons", function (req, res) {

            var directoryPath = path.resolve("public/" + req.params.directory),

                response = {
                    files: []
                };

            fs.readdir(directoryPath, function (err, data) {

                if (err || !data) {

                    res(response);

                    return;
                }

                processAndSendIcons(data, directoryPath, response, req, res);
            });
        });

        req("icons.delete", function (req) {

            var parsed = path.parse(req.params.path),

                filePath = path.resolve("public/" + req.params.path),
                thumbPath = path.resolve(path.join("public", parsed.dir, "/thumbs", parsed.base));

            fs.unlink(filePath, function () {});

            if (mime.lookup(filePath).match(/svg|xml/)) {

                fs.unlink(thumbPath, function () {});
            }
        });

        req("icons.search", function (req, res) {

            Icon.userSearch(req.params.search, function (err, result) {

                var files = [];

                if (!err && result) {

                    var i = result.length - 1;

                    for (i; i >= 0; i--) {

                        files.push({
                            name: result[i].name,
                            directory: result[i].category,
                            svg: result[i].data
                        });
                    }
                }

                return res({
                    files: files
                });

            });

        });

    });

});
