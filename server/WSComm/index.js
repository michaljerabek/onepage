/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/

var config = require("./../../config");
var io = require("socket.io")(config.websocket.port);
var WSReq = require("./WSReq");
var mongoose = require("mongoose");

var getHostFromSocket = function (socket) {

    return socket.handshake.headers.host.split(":").shift();
};

io.on("connection", function (socket) {

    var req = WSReq(socket);
    var host = getHostFromSocket(socket);
    var room = host.replace(".", "_");
    var db;

    socket.join(room);

    socket.on("disconnect", function () {

        if (db) {

            db.close();

            req = null;
            db = null;
            socket = null;
        }
    });

    socket.on("databaseName", function (data) {

        db = mongoose.createConnection("mongodb://" + config.Db.users.host + "/" + data.databaseName);

//        var adminRequests = require("./Admin");
        var pageRequests = require("./Page");

//        adminRequests(req, db);
        pageRequests(req, db);
    });

});
