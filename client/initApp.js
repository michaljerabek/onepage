/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/
/*global jQuery, $*/

var Ractive = require("ractive");
var io = require("socket.io-client");

Ractive.defaults.findSiblingComponents = function (name) {

    var components = this.parent.findAllComponents(name),
        c = components.length - 1;

    for (c; c > -1; c--) {

        if (components[c] === this || components[c].parent !== this.parent) {

            components.splice(c, 1);
        }
    }

    return components;
};

Ractive.$win = Ractive.$win || $(window);
Ractive.$scrollingElement = Ractive.$scrollingElement || $("html, body");

var loadLibs = function () {

    require("ractive-touch");

    require("perfect-scrollbar/jquery.js")(jQuery);
};

var initPolyfills = function () {

    if (!window.Promise) {

        window.Promise = Ractive.Promise;
    }

    require("polyfill-function-prototype-bind");

    require("request-frame")("native");
};

var connectToSocketIO = function (config, databaseName) {

    var socket = io("http://" + window.location.hostname + ":" + config.websocket.port);

    Ractive.defaults.req = require("./../server/WSComm/WSReq")(socket);

    socket.on("connect", function () {

        socket.emit("databaseName", {
            databaseName: databaseName
        });
    });

    return socket;
};

module.exports = function (ractive, ractiveData, config) {

    var App;

    (function (ns) {

        initPolyfills();

        loadLibs();

        connectToSocketIO(config, ractiveData.databaseName);

        console.time("pageLoaded");

        App = ractive({

            el: "#app",

            data: ractiveData,

            events: {
//                tap: require("ractive-events-tap")
                hover: require("ractive-events-hover")
            },

            transitions: {
                slide: require("ractive-transitions-slide"),
                fade: require("ractive-transitions-fade")
            }
        });

        if (typeof ns.env !== "undefined" && ns.env === "dev") {

            ns.App = App;
        }

    }(window));

    return App;

};
