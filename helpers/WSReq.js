var on = require("./on");

var serverReq = function (socket, reqPrefix, resPrefix) {

    reqPrefix = typeof reqPrefix !== "string" ? "req." : reqPrefix + ".";

    resPrefix = typeof resPrefix !== "string" ? "res." : resPrefix + ".";

    return function req(type, res) {

        socket.on(reqPrefix + type, function (request) {

            res(request, function (data, broadcast) {

                if (broadcast === true) {

                    socket.broadcast.emit(resPrefix + type, data);

                } else if (typeof broadcast === "string") {

                    socket.broadcast.to(broadcast).emit(resPrefix + type, data);

                } else {

                    socket.emit(resPrefix + type, data);
                }
            });
        });
    };
};

var clientReq = function (socket, reqPrefix, resPrefix) {

    reqPrefix = typeof reqPrefix !== "string" ? "req." : reqPrefix + ".";

    resPrefix = typeof resPrefix !== "string" ? "res." : resPrefix + ".";

    return function req(name, params) {

        var request = {
            params: params || {},
            name: name,
            hostname: window.location.hostname,
            timestamp: Date.now()
        };

        var promise = new Promise(function (resolve, reject) {

            socket.once(resPrefix + name, function (response) {

                if (response.error) {

                    return reject(response);
                }

                resolve(response);
            });
        });

        socket.emit(reqPrefix + name, request);

        return promise;
    };
};

module.exports = on.server ? serverReq : clientReq;
