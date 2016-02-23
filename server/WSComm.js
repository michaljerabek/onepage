/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/

var config = require("./../config/shared");
var io = require("socket.io")(config.websocket.port);
var WSReq = require("./../helpers/WSReq");

var getHostFromSocket = function (socket) {

    return socket.handshake.headers.host.split(":").shift();
};

io.on("connection", function (socket) {

    var host = getHostFromSocket(socket);

    var room = host.replace(".", "_");

    socket.join(room);

    var req = WSReq(socket);

    req("/test", function (req, res) {
        res({
            WS: true
        });
    });

});
