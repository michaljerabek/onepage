var on = require("./../../helpers/on");

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

                    socket.emit(resPrefix + type + (request.doNotForceLastRequest ? "" : request.timestamp), data);
                }
            });
        });
    };
};

var clientReq = function (socket, reqPrefix, resPrefix) {

    var requestIds = {};

    reqPrefix = typeof reqPrefix !== "string" ? "req." : reqPrefix + ".";

    resPrefix = typeof resPrefix !== "string" ? "res." : resPrefix + ".";

    return function req(name, params, doNotForceLastRequest) {

        var id = Date.now();

        requestIds[name] = id;

        var request = {
            params: params || {},
            name: name,
            hostname: window.location.hostname,
            timestamp: id,
            doNotForceLastRequest: doNotForceLastRequest
        };

        var promise = new Promise(function (resolve, reject) {

            socket.once(resPrefix + name + (doNotForceLastRequest ? "" : id), function (response) {

                if (id !== requestIds[name]) {

                    return;
                }

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
