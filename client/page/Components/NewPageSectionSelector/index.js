/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var Ractive = require("ractive");

module.exports = Ractive.extend({

    template: require("./index.tpl"),

    CLASS: {
        self: "E_NewPageSectionSelector",

        sectionType: "E_NewPageSectionSelector--page-section-type",
        clone: "E_NewPageSectionSelector--clone",
        cloneRemoved: "E_NewPageSectionSelector--clone__removed",
        inserted: "E_NewPageSectionSelector__inserted"
    },

    components: {
    },

    partials: {
    },

    data: function () {

        return {
        };
    },

    onrender: function () {

    },

    onconfig: function () {

    },

    oncomplete: function () {
    }

});
