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
                openTab: 1,

                imageColors: {}
            };
        },

        onrender: function () {

            this.observe("openTab", function () {

                this.set("lastInputType", this.findComponent("ColorPicker").get("inputType"));

                this.toggle("toggleTab");

                this.cancelImageColorsObservers();

            }, {init: false});

            this.observe("openTab", function () {

                this.saveColorsFromImage();

            }, {init: false, defer: true});

            this.saveColorsFromImage();
        },

        onconfig: function () {

            this.Page = this.findParent("Page");

            this.set("mostUsedColors", this.Page.findMostUsedColors());

            this.imageColorsObservers = [];
        },

        oncomplete: function () {

        },

        onteardown: function () {

            this.cancelImageColorsObservers();
        },

        //Uloží nalezené barvy z obrázků, aby se při každém přepnutí tabu, nehledaly znovu.
        //ColorPickerPalette musí mít atribut id, pomocí kterého se zjistí v datech "imageColors",
        //jestli už barvy pro danou paletu existují.
        saveColorsFromImage: function () {

            var colorSettings = this;

            this.findAllComponents("ColorPickerPalette").forEach(function (palette) {

                var image = palette.get("image");

                if (image && image !== "none") {

                    var observer = palette.observeOnce("colors", function (colors) {

                        if (colors && colors.length) {

                            colorSettings.set("imageColors." + palette.get("id"), {
                                title: palette.get("title"),
                                colors: colors
                            });
                        }
                    }, {init: false});

                    colorSettings.imageColorsObservers.push(observer);
                }
            });
        },

        cancelImageColorsObservers: function () {

            var o = this.imageColorsObservers.length - 1;

            for (o; o >= 0; o--) {

                this.imageColorsObservers[o].cancel();

                this.imageColorsObservers.splice(o, 1);
            }
        }
    });

}));

