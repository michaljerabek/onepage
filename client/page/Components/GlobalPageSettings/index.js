/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var Ractive = require("ractive"),

    ColorPicker = require("./../../../libs/Components/ColorPicker");

module.exports = Ractive.extend({

    template: require("./index.tpl"),

    components: {
        ColorPicker: ColorPicker
    },

    partials: {
    },

    data: function () {

        return {
            fontTypes: {
                "P_font-type-1" : "Serif",
                "P_font-type-2" : "Sans Serif"
            }
        };
    },

    onrender: function () {

    },

    onconfig: function () {

    },

    oncomplete: function () {
    }

});
