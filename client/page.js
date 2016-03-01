/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/
/*global ractiveData*/

var Ractive = require("ractive");
var config = require("./../config");
var on = require("./../helpers/on");

var ractive = function (settings) {

    return new Ractive({

        enhance: true,

        el: settings.el,

        template: require("./page.tpl"),

        components: {
            Page: require("./Page/")
        },

        partials: {

        },

        events: settings.events,

        transitions: settings.transitions,

        data: settings.data,

        onconfig: function () {
        }

    });

};

if (on.client) {

    ractive = require("./initApp")(ractive, ractiveData, config);

    ractiveData = null;
}

module.exports = ractive;

