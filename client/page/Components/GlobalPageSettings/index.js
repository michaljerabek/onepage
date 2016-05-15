/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var Ractive = require("ractive"),

    ColorPicker = require("./../../../libs/Components/ColorPicker"),
    ColorPickerPalette = require("./../../../libs/Components/ColorPicker/Components/ColorPickerPalette");

module.exports = Ractive.extend({

    template: require("./index.tpl"),

    OPTIONS: {
        ANIMATIONS: {

        }
    },

    components: {
        ColorPicker: ColorPicker,
        ColorPickerPalette: ColorPickerPalette
    },

    partials: {
        fontSettings: require("./partials/font-settings.tpl"),
        colorPaletteSettings: require("./partials/color-palette-settings.tpl")
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
            },

            colorPalettes: [
                {
                    colors: [
                        "rgb(255, 255, 255)",
                        "rgb(0, 255, 255)",
                        "rgb(255, 0, 255)",
                        "rgb(255, 255, 0)",
                        "rgb(0, 0, 0)"
                    ],
                    textLight: "rgb(255, 255, 255)",
                    textDark: "rgb(0, 0, 0)",
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(255, 255, 255)",
                        "rgb(0, 255, 255)",
                        "rgb(255, 0, 255)",
                        "rgb(255, 255, 0)",
                        "rgb(0, 0, 0)"
                    ],
                    textLight: "rgb(255, 255, 255)",
                    textDark: "rgb(0, 0, 0)",
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(255, 255, 255)",
                        "rgb(0, 255, 255)",
                        "rgb(255, 0, 255)",
                        "rgb(255, 255, 0)",
                        "rgb(0, 0, 0)"
                    ],
                    textLight: "rgb(255, 255, 255)",
                    textDark: "rgb(0, 0, 0)",
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(198, 48, 48)",
                        "rgb(49, 190, 98)",
                        "rgb(214, 73, 149)",
                        "rgb(242, 185, 32)",
                        "rgb(57, 214, 105)"
                    ],
                    textLight: "rgb(255, 255, 255)",
                    textDark: "rgb(0, 0, 0)",
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(255, 255, 255)",
                        "rgb(0, 255, 255)",
                        "rgb(255, 0, 255)",
                        "rgb(255, 255, 0)",
                        "rgb(0, 0, 0)"
                    ],
                    textLight: "rgb(255, 255, 255)",
                    textDark: "rgb(0, 0, 0)",
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(255, 255, 255)",
                        "rgb(0, 255, 255)",
                        "rgb(255, 0, 255)",
                        "rgb(255, 255, 0)",
                        "rgb(0, 0, 0)"
                    ],
                    textLight: "rgb(255, 255, 255)",
                    textDark: "rgb(0, 0, 0)",
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(255, 255, 255)",
                        "rgb(0, 255, 255)",
                        "rgb(255, 0, 255)",
                        "rgb(255, 255, 0)",
                        "rgb(0, 0, 0)"
                    ],
                    textLight: "rgb(255, 255, 255)",
                    textDark: "rgb(0, 0, 0)",
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(255, 255, 255)",
                        "rgb(0, 255, 255)",
                        "rgb(255, 0, 255)",
                        "rgb(255, 255, 0)",
                        "rgb(0, 0, 0)"
                    ],
                    textLight: "rgb(255, 255, 255)",
                    textDark: "rgb(0, 0, 0)",
                    headerImg: ""
                }
            ]
        };
    },

    onrender: function () {

    },

    onconfig: function () {


    },

    oncomplete: function () {
    }

});
