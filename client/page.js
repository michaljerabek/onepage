/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/
/*global ractiveData*/

var Ractive = require("ractive");
var config = require("./../config");
var on = require("./../helpers/on");
var io = require("socket.io-client");

var ractive = function (data, el) {

    if (on.client) {

        var socket = io("http://" + window.location.hostname + ":" + config.websocket.port);

        Ractive.defaults.req = require("./../helpers/WSReq")(socket);
    }

    return new Ractive({

        el: el,

        template: require("./tpl.html"),

        components: {
            Page: require("./page/")
        },

        partials: {

        },

        data: data,

        onconfig: function () {
        }

    });

};

if (on.client) {

    if (!window.Promise) {

        window.Promise = Ractive.Promise;
    }

    (function (ns) {

        var App = ractive(ractiveData, "#app");

        if (typeof ns.env !== "undefined" && ns.env === "dev") {

             ns.App = App;
        }

    }(window));
}

module.exports = ractive;

