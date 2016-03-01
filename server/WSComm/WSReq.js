var on = require("./../../helpers/on");

var serverReq = function (socket, onReq, reqPrefix, resPrefix) {

    var requestTimes = {};

    reqPrefix = typeof reqPrefix !== "string" ? "req." : reqPrefix + ".";

    resPrefix = typeof resPrefix !== "string" ? "res." : resPrefix + ".";

    return function req(name, reqHandler) {

        socket.on(reqPrefix + name, function (request) {

            if (!request.doNotForceLastRequest && requestTimes[name] > request.timestamp) {

                if (typeof onReq === "function") {

                    request.rejected = true;

                    onReq(request);
                }

                return;
            }

            requestTimes[name] = request.timestamp;

            if (typeof onReq === "function") {

                onReq(request);
            }

            reqHandler(request, function (data, broadcast) {

                if (broadcast === true) {

                    socket.broadcast.emit(resPrefix + name, data);

                } else if (typeof broadcast === "string") {

                    socket.broadcast.to(broadcast).emit(resPrefix + name, data);

                } else {

                    socket.emit(resPrefix + name + (request.doNotForceLastRequest ? "" : request.timestamp), data);
                }
            });
        });
    };
};

var clientReq = function (socket, onRes, reqPrefix, resPrefix) {

    var requestTimes = {};

    reqPrefix = typeof reqPrefix !== "string" ? "req." : reqPrefix + ".";

    resPrefix = typeof resPrefix !== "string" ? "res." : resPrefix + ".";

    return function req(name, params, doNotForceLastRequest) {

        var timestamp = Date.now();

        requestTimes[name] = timestamp;

        var request = {
            params: params || {},
            name: name,
            hostname: window.location.hostname,
            timestamp: timestamp,
            doNotForceLastRequest: doNotForceLastRequest
        };

        var promise = new Promise(function (resolve, reject) {

            socket.once(resPrefix + name + (doNotForceLastRequest ? "" : timestamp), function (response) {

                if (timestamp !== requestTimes[name]) {

                    if (typeof onRes === "function") {

                        response.rejected = true;

                        onRes(response);
                    }

                    return;
                }

                if (typeof onRes === "function") {

                    onRes(response);
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
