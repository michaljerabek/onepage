/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/

var config = require("./../../config");
var io = require("socket.io")(config.websocket.port);
var WSReq = require("./WSReq");
var mongoose = require("mongoose");

var PageModel = require("./../models/Page");

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
        }
    });

    socket.on("databaseName", function (data) {

        db = mongoose.createConnection("mongodb://" + config.DB.global.host + "/" + data.databaseName);

        var adminRequests = require("./admin");
//        require("./page")(req, db);

        adminRequests(req, db);
    });

});
