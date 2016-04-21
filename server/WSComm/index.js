/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/

var config = require("./../../config");
var io = require("socket.io")(config.websocket.port);
var WSReq = require("./WSReq");
var mongoose = require("mongoose");
var fs = require("fs");
var path = require("path");
var mime = require("mime");

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

                    res({
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

                var f = data.length - 1;

                for (f; f >= 0; f--) {

                    var filePath = path.join(directoryPath, data[f]),
                        stat = fs.statSync(filePath),
                        mimeType = "",
                        thumbPath,
                        thumbStat;

                    if (stat.isFile()) {

                        mimeType = mime.lookup(filePath);

                        if (mimeType.match(/image/)) {

                            try {

                                thumbPath = path.join(directoryPath, "thumbs", data[f]);
                                thumbStat = fs.statSync(thumbPath);

                                response.files.unshift({
                                    name: data[f],
                                    path: path.join(req.params.directory, data[f]),
                                    directory: req.params.directory
                                });

                            } catch (e) {

                                if (!directoryPath.match(/^library/)) {

                                    fs.unlink(filePath, function () {});
                                }
                            }
                        }
                    }
                }

                res(response);
            });
        });

        req("images.delete", function (req) {

            var parsed = path.parse(req.params.path),

                filePath = path.resolve("public/" + req.params.path),
                thumbPath = path.resolve(path.join("public", parsed.dir, "/thumbs", parsed.base));

            fs.unlink(filePath, function () {});
            fs.unlink(thumbPath, function () {});
        });

    });

});
