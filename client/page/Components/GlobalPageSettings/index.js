/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var Ractive = require("ractive"),

    Languages = require("./../../../libs/Languages.js"),
    EventEmitter = require("./../../../libs/EventEmitter.js")(),

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
        colorPaletteSettings: require("./partials/color-palette-settings.tpl"),
        languageSelector: require("./partials/language-selector.tpl")
    },

    data: function () {

        return {
            fontTypes: require("./../../PAGE_SETTINGS/FONT_TYPES"),

            colorPalettes: require("./../../PAGE_SETTINGS/COLOR_PALETTES"),

            languages: Languages,
            tplLangs: ["cs", "sk", "en"]
        };
    },

    onrender: function () {

        if (!this.get("settings.fontType")) {

            this.set("settings.fontType", Object.keys(this.get("fontTypes"))[0]);
        }
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

        this.on("removeLang", this.removeLang);
        this.on("createLang", this.createLang);
        this.on("changeTplLang", this.changeTplLang);
    },

    oncomplete: function () {

    },

    onteardown: function () {

    },

    removeLang: function (lang) {

        var langs = this.get("settings.lang.langs");

        delete langs[lang];

        this.fire("changeCurrentLang", this.get("settings.lang.defaultLang"));

        EventEmitter.trigger("removeLang.PageSection", lang);
    },

    changeTplLang: function (e, lang) {

        this.parent.set("page.tplLang", lang);

        this.set("settings.lang.langs." + this.get("lang") + ".template", lang);
    },

    createLang: function (e, lang) {

        this.set("settings.lang.langs." + lang, {
            template: ~this.get("tplLangs").indexOf(lang) ? lang : "en"
        });
    }
});
