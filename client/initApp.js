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

//    require("viewport-units-buggyfill").init({
//        hacks: require("viewport-units-buggyfill/viewport-units-buggyfill.hacks")
//    });

    require("ractive-touch");
    require("ractive-transitions-slidehorizontal");
    require("ractive-transitions-slidevh");

    require("jquery-bez");

    require("perfect-scrollbar/jquery.js")(jQuery);
};

var initPolyfills = function () {

    if (!window.Promise) {

        window.Promise = Ractive.Promise;
    }

    require("polyfill-function-prototype-bind");

    require("request-frame")("native");
};

var connectToSocketIO = function (config, databaseName, userId) {

    var socket = io("http://" + window.location.hostname + ":" + config.websocket.port);

    Ractive.defaults.req = require("./../server/WSComm/WSReq")(socket);

    socket.on("connect", function () {

        socket.emit("databaseName", {
            databaseName: databaseName,
            userId: userId
        });
    });

    return socket;
};

module.exports = function (ractive, ractiveData, config) {

    var App;

    (function (ns) {

        initPolyfills();

        loadLibs();

        connectToSocketIO(config, ractiveData.databaseName, ractiveData.userId);

        console.time("pageLoaded");

        var ractiveKeyEvents = require("ractive-events-keys"),
            ractiveWindowEvents = require("./libs/ractive-events-window");

        App = ractive({

            el: "#app",

            partials: {
            },

            components: {
            },

            data: ractiveData,

            events: {
                hover           : require("ractive-events-hover"),
                enter           : ractiveKeyEvents.enter,
                space           : ractiveKeyEvents.space,
                escape          : ractiveKeyEvents.escape,
                windowMousedown : ractiveWindowEvents.windowMousedown,
                windowMousemove : ractiveWindowEvents.windowMousemove,
                windowMouseup   : ractiveWindowEvents.windowMouseup,
                windowTouchstart: ractiveWindowEvents.windowTouchstart,
                windowTouchmove : ractiveWindowEvents.windowTouchmove,
                windowTouchend  : ractiveWindowEvents.windowTouchend,
                windowResize    : ractiveWindowEvents.windowResize
            },

            transitions: {
                slide: require("ractive-transitions-slide"),
                fade : require("ractive-transitions-fade"),
                attr : require("ractive-transitions-attr")
            }
        });

        if (typeof ns.env !== "undefined" && ns.env === "dev") {

            ns.App = App;
        }

    }(window));

    return App;

};
