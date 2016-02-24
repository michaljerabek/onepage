/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/
/*global ractiveData*/

var Ractive = require("ractive");
var config = require("./../config");
var on = require("./../helpers/on");

var ractive = function (data, el) {

    return new Ractive({

        el: el,

        template: require("./page.tpl"),

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

    ractive = require("./initApp")(ractive, ractiveData, config);

    ractiveData = null;
}

module.exports = ractive;

