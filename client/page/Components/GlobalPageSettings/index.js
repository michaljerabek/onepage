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
            fontTypes: require("./../../PAGE_SETTINGS/FONT_TYPES"),

            colorPalettes: require("./../../PAGE_SETTINGS/COLOR_PALETTES")
        };
    },

    onrender: function () {

    },

    onconfig: function () {

        this.on("ColorPicker.*", function (data) {

            if (data && typeof data === "object" && data.key === "current") {

                var state = !data.context.get("animate");

                this.parent.forEachPageSection(function (section) {

                    section.set("stopColorTransitions", state);
                });
            }
        });

        this.observe("settings.colorPalette", function (newValue, oldValue) {

            if (newValue !== oldValue) {

                this.parent.forEachPageSection(function (section) {

                    section.set("stopColorTransitions", false);
                });
            }
        }, {init: false});
    },

    oncomplete: function () {

    },

    onteardown: function () {

    }

});
