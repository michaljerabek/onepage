var on = require("./../../helpers/on");

var serverReq = function (socket, onReq, reqPrefix, resPrefix) {

    var requestTimes = {};

    reqPrefix = typeof reqPrefix !== "string" ? "req." : reqPrefix + ".";

    resPrefix = typeof resPrefix !== "string" ? "res." : resPrefix + ".";

    function req(name, reqHandler) {

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

        return {
            cancelReq: function () {

                socket.removeAllListeners(resPrefix + name);
            },

            reqName: reqPrefix + name
        };
    }

    req.socket = socket;

    req.removeListener = function (reqName, reqHandler) {

        socket.removeListener(reqName, reqHandler);
    };

    req.removeAllListeners = function (reqName) {

        socket.removeListener(reqName);
    };

    return req;
};

var clientReq = function (socket, onRes, reqPrefix, resPrefix) {

    var requestTimes = {};

    reqPrefix = typeof reqPrefix !== "string" ? "req." : reqPrefix + ".";

    resPrefix = typeof resPrefix !== "string" ? "res." : resPrefix + ".";

    function req(name, params, sendOnly, doNotForceLastRequest) {

        var timestamp = Date.now();

        requestTimes[name] = timestamp;

        var request = {
            params: params || {},
            name: name,
            hostname: window.location.hostname,
            timestamp: timestamp,
            doNotForceLastRequest: doNotForceLastRequest
        },

            promise = {},

            promiseReject = function () {};

        if (!sendOnly) {

            promise = new Promise(function (resolve, reject) {

                promiseReject = reject;

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
        }

        promise.reqName = resPrefix + name + (doNotForceLastRequest ? "" : timestamp);

        promise.cancelReq = function (rejectPromise) {

            socket.removeAllListeners(resPrefix + name + (doNotForceLastRequest ? "" : timestamp));

            if (rejectPromise) {

                promiseReject({ canceled: true });
            }
        };

        socket.emit(reqPrefix + name, request);

        return promise;
    }

    req.socket = socket;

    req.removeListener = function (reqName, reqHandler) {

        socket.removeListener(reqName, reqHandler);
    };

    req.removeAllListeners = function (reqName) {

        socket.removeListener(reqName);
    };

    return req;
};

module.exports = on.server ? serverReq : clientReq;
