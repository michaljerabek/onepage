/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/
/*global ractiveData*/

var Ractive = require("ractive");
var config = require("./../config");
var on = require("./../helpers/on");

var ractive = function (settings) {

    Ractive.EDIT_MODE = !settings.data.page || settings.data.page.editMode;

    return new Ractive({

        enhance: true,

        el: settings.el,

        template: require("./admin.tpl"),

        components: {
            Page: require("./Page/"),
            Admin: require("./Admin/"),
            Dialog: require("./libs/Components/Dialog")
        },

        partials: {

        },

        events: settings.events,

        transitions: settings.transitions,

        data: settings.data,

        onconfig: function () {
        },

        onrender: function () {
        }

    });

};

if (on.client) {

    ractive = require("./initApp")(ractive, ractiveData, config);

    ractiveData = null;
}

module.exports = ractive;

