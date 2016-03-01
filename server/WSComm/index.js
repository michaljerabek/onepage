/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/

var config = require("./../../config");
var io = require("socket.io")(config.websocket.port);
var WSReq = require("./WSReq");
var mongoose = require("mongoose");

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
        db = connectToDb(db, databaseName);
        dbConnectionTimeout();

        socket.join(databaseName);

//        var adminRequests = require("./Admin");
        var pageRequests = require("./Page");

//        adminRequests(req, db);
        pageRequests(req, db);
    });

});
