/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageSectionSettings = require("./../../../PageSectionSettings"),
            ColorPicker = require("./../../../../../../libs/Components/ColorPicker"),
            ColorPickerPalette = require("./../../../../../../libs/Components/ColorPicker/Components/ColorPickerPalette"),

            template = require("./index.tpl");

        module.exports = factory(PageSectionSettings, ColorPicker, ColorPickerPalette, template);

    } else {

        root.ColorSettings = factory(root.PageSectionSettings, root.ColorPicker, root.ColorPickerPalette, "");
    }

}(this, function (PageSectionSettings, ColorPicker, ColorPickerPalette, template) {

    return PageSectionSettings.extend({

//        template: template,

        components: {
            ColorPickerPalette: ColorPickerPalette,
            ColorPicker: ColorPicker
        },

        partials: {
            pageSectionSettingsContent: template,
            ColorSettingsNavItem: require("./color-settings-nav-item.tpl"),
            ColorSettingsTab:  require("./color-settings-tab.tpl")
        },

        data: function () {

            return {
                openTab: 1,

                imageColors: {}
            };
        },

        onrender: function () {

            this.superOnrender();

            this.observe("openTab", function () {

                this.toggle("toggleTab");

                this.cancelImageColorsObservers();

            }, {init: false});

            this.observe("openTab", function () {

                this.saveColorsFromImage();

            }, {init: false, defer: true});

            this.saveColorsFromImage();
        },

        onconfig: function () {

            this.superOnconfig();

            this.Page = this.findParent("Page");

            this.set("mostUsedColors", this.Page.findMostUsedColors());

            this.imageColorsObservers = [];
        },

        oncomplete: function () {

            this.superOncomplete();

        },

        onteardown: function () {

            this.superOnteardown();

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

                    var observer = palette.observe("colors", function (colors) {

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

