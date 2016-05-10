/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var Ractive = require("ractive");

module.exports = Ractive.extend({

    template: require("./index.tpl"),

    CLASS: {
        self: "E_NewPageSectionSelector",

        sectionThumb: "E_SectionThumb",
        sectionThumbDisabled: "E_SectionThumb__disabled",
        clone: "E_SectionThumb--clone",
        cloneRemoved: "E_SectionThumb--clone__removed",
        cancelAddSection: "E_SectionThumb--clone__cancel",
        inserted: "E_SectionThumb__inserted"
    },

    components: {
    },

    partials: {
        SectionThumb: require("./SectionThumb/index.tpl")
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
