/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageElement = require("./../../"),
            Ractive = require("ractive"),

            U = require("./../../../../../libs/U"),
            on = require("./../../../../../../helpers/on"),

            partials = {
                pageElementEditUI: require("./edit-ui.tpl"),
                pageElementContent: require("./index.tpl")
            },

            components = {
            };

        module.exports = factory(
            PageElement,
            Ractive,
            components,
            partials,
            U,
            on
        );

    } else {

        root.PageElementTextContent = factory(
            root.PageElement,
            root.Ractive,
            {},
            {},
            root.U,
            {client: true}
        );
    }

}(this, function (PageElement, Ractive, components, partials, U, on) {

//    var CLASS = {
//        menuElement: "P_PageSectionMenu"
//    };

    return PageElement.extend({

        MIN_TEXT_CONTRAST: 5,

        components: components,

        partials: partials,

        data: function () {

            return {
                type: "menu",
                hasEditUI: true,
                settingsTitle: "Nastavení hlavního menu"
            };
        },

        onconfig: function () {

            this.superOnconfig();

            this.on("ColorPickerPalette.setColor", function (event, x, y, palette) {

                var pathName = (palette.container || palette.parent).get("pathName");

                if (!pathName) {

                    return;
                }

                //uživatel nastavuje vlastní barvu z výchozích -> uložit odkaz na barvu, aby se měnila v případě změny v paletě
                if (pathName === "backgroundColor") {

                    if (palette.get("id") === "defaultColors") {

                        this.set("element.backgroundColorRef", event.index.i);

                    } else {

                        this.set("element.backgroundColorRef", null);
                    }

                } else if (pathName === "textColor") {

                    if (palette.get("id") === "defaultColors") {

                        this.set("element.textColorRef", event.index.i);

                    } else {

                        this.set("element.textColorRef", null);
                    }
                }

            }.bind(this));

            //"ruční" nastavení barvy
            this.on("ColorPicker.activated", function (colorPicker) {

                var pathName = colorPicker.get("pathName");

                if (!pathName) {

                    return;
                }

                if (pathName === "backgroundColor") {

                    this.set("element.backgroundColorRef", null);

                } else if (pathName === "textColor") {

                    this.set("element.textColorRef", null);

                }

            }.bind(this));

            this.observe("openPageElementSettings", function (current, prev) {

                if (current === "settings") {

                    this.set("restoreFill", !this.get("element.fill"));

                    this.set("element.fill", true);

                } else if (prev === "settings" && this.get("restoreFill")) {

                    this.set("restoreFill", false);
                    this.set("element.fill", false);
                }

            }, {init: false});
        },

        onrender: function () {

            this.superOnrender();

            this.initObservers();
        },

        initObservers: function () {

            this.defPaletteObserver = this.Page.observe("page.settings.colorPalette.colors", function (current) {

                if (!current) {

                    return;
                }

                var backgroundColorRef = this.get("element.backgroundColorRef"),
                    backgroundColor = this.get("element.backgroundColor"),

                    textColorRef = this.get("element.textColorRef"),
                    textColor = this.get("element.textColor");

                if (typeof backgroundColorRef === "number" && backgroundColor && current[backgroundColorRef] && current[backgroundColorRef] !== backgroundColor) {

                    this.set("element.backgroundColor", current[backgroundColorRef]);
                }

                if (typeof textColorRef === "number" && textColor && current[textColorRef] && current[textColorRef] !== textColor) {

                    this.set("element.textColor", current[textColorRef]);
                }

            }.bind(this), {init: false});

            this.fillObserver = this.observe("element.fill", function () {

                this.PageSection.set("stopColorTransitions", false);

            }, {init: false});

            this.backgroundColorObserver = this.observe("element.backgroundColor", function (color) {

                var generator = this.Page.defaultColorsGenerator;

                this.set("element.autoTextColor", color ? generator.getBlackWhite(color, this.MIN_TEXT_CONTRAST, true) : "");

            }, {init: false});
        },

        oncomplete: function () {

            this.superOncomplete();
        },

        onteardown: function () {

            this.superOnteardown();

            if (this.defPaletteObserver) {

                this.defPaletteObserver.cancel();
            }

            if (this.fillObserver) {

                this.fillObserver.cancel();
            }

            if (this.backgroundColorObserver) {

                this.backgroundColorObserver.cancel();
            }
        },

        removeColorRefs: function () {

            var element = this.get("element");

            element.textColorRef = null;
            element.backgroundColorRef = null;
            element.textColor = "";
            element.backgroundColor = "";
            element.autoTextColor = "";

            this.update("element");
        }
    });

}));

