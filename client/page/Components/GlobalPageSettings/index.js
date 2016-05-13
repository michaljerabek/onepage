/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var Ractive = require("ractive"),

    ColorPicker = require("./../../../libs/Components/ColorPicker"),
    ColorPickerPalette = require("./../../../libs/Components/ColorPicker/Components/ColorPickerPalette");

module.exports = Ractive.extend({

    template: require("./index.tpl"),

    components: {
        ColorPicker: ColorPicker,
        ColorPickerPalette: ColorPickerPalette
    },

    partials: {
        fontSettings: require("./partials/font-settings.tpl")
    },

    data: function () {

        return {
            fontTypes: {
                "P_font-type-1" : {
                    title: "Serif",
                    body: "Serif"
                },
                "P_font-type-2" : {
                    title: "Sans Serif",
                    body: "Sans Serif"
                },
                "P_font-type-3" : {
                    title: "Serif",
                    body: "Serif"
                },
                "P_font-type-4" : {
                    title: "Sans Serif",
                    body: "Sans Serif"
                }
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
