/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/
/*global ractiveData*/

var Ractive = require("ractive");
var config = require("./../config");
var on = require("./../helpers/on");

var ractive = function (settings) {

    return new Ractive({

        el: settings.el,

        template: require("./admin.tpl"),

        components: {
            Page: require("./page/"),
            Admin: require("./admin/")
        },

        partials: {

        },

        events: settings.events,

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

