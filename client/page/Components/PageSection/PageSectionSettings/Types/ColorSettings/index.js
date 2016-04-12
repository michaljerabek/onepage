/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var SuperPageSectionSettingsType = require("./../SuperPageSectionSettingsType"),
            ColorPicker = require("./../../../../../../libs/Components/ColorPicker"),
            ColorPickerPalette = require("./../../../../../../libs/Components/ColorPicker/Components/ColorPickerPalette"),

            template = require("./index.tpl");

        module.exports = factory(SuperPageSectionSettingsType, ColorPicker, ColorPickerPalette, template);

    } else {

        root.ColorSettings = factory(root.SuperPageSectionSettingsType, root.ColorPicker, root.ColorPickerPalette, "");
    }

}(this, function (SuperPageSectionSettingsType, ColorPicker, ColorPickerPalette, template) {

    return SuperPageSectionSettingsType.extend({

        template: template,

        components: {
            ColorPickerPalette: ColorPickerPalette,
            ColorPicker: ColorPicker
        },

        partials: {

        },

        data: function () {

            return {
                openTab: 1
            };
        },

        onrender: function () {

            this.observe("openTab", function () {

                this.toggle("toggleTab");

            }, {init: false});

        },

        onconfig: function () {

            this.Page = this.findParent("Page");

            this.set("mostUsedColors", this.Page.findMostUsedColors());
        },

        oncomplete: function () {

        }

    });

}));

