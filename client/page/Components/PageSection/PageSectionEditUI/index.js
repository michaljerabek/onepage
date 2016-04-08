/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),
            EventEmitter = require("./../../../../libs/EventEmitter")(),
            on = require("./../../../../../helpers/on"),

            template = require("./index.tpl"),

            partials = {
                pageSectionEditUIContent: require("./partials/content.tpl"),
                EditUIControlsTopLeft: require("./partials/top-left.tpl"),
                EditUIControlsTopRight: require("./partials/top-right.tpl"),
                EditUIControlsBottomLeft: require("./partials/bottom-left.tpl"),
                EditUIControlsBottomRight: require("./partials/bottom-right.tpl")
            };

        module.exports = factory(Ractive, EventEmitter, template, partials, on);

    } else {

        root.BasicEditUI = factory(root.Ractive, $({}), "", {client: true});
    }

}(this, function (Ractive, EventEmitter, template, partials, on) {

    /*
     * Základní typ ovládacích prvků sekce. Každý další typ by měl rozšiřovat tento typ.
     * Komponent obsahuje "partials" s ovládacími prvky pro každý roh. Podtypy mohou tyto partialy
     * přepsat nebo je možné je vypnout přidáním dat:
     * { EditUIControlsTopLeft: false }
     * Nebo je možné vypnout jen některá tlačítka:
     * { removeSectionButton: false }
     */

    return Ractive.extend({

        EDIT_UI: true,

        CLASS: {
            self: "E_PageSectionEditUI",
            hiddenByUser: "E_PageSectionEditUI__hidden-by-user"
        },

        template: template,

        components: {
        },

        partials: partials || {},

        onconfig: function () {
            this.superOnconfig();
        },

        onrender: function () {
            this.superOnrender();
        },

        oncomplete: function () {
            this.superOncomplete();
        },

        onteardown: function () {
            this.superOnteardown();
        },

        superOnconfig: function () {

            this.Page = this.findParent("Page");
            this.PageSection = this.getPageSection();

            if (!on.client) {

                return;
            }

            EventEmitter.on("hover.PageSectionEditUI hasOutline.PageSection", function (event, state, editUI) {

                if (state && editUI !== this) {

                    this.blockTouchend = false;

                    if (this.hiddenByUser) {

                        //zrušit this.hiddenByUser === true, pokud sekce nemá outline ani settings
                        this.setHiddenByUser(!(!this.PageSection.get("hasOutline") && !this.PageSection.get("hasSettings")));
                    }

                    this.blockHover = false;

                    this.set("hover", false);
                }

                if (event.type === "hasOutline" && !this.hiddenByUser && state && editUI === this) {

                    this.set("hover", true);
                }

            }.bind(this));

            this.observe("hover", function (state) {

                if (!state) {

                    this.blockHover = false;
                }

            }, {init: false});

            //událost je spuštěna v příslušné PageSection
            this.on("hover", function (event/*, pageSection*/) {

                if (this.blockHover && event.hover) {

                    return;
                }

                //přejetí z PageElementSetitngs -> neměnit stav UI
                if (event.hover && $(event.original.fromElement).closest("." + this.parent.components.PageElementSettings.prototype.CLASS.self).length) {

                    return;
                }

                //přejetí do PageElementSettings -> neměnit stav UI
                if (!event.hover && $(event.original.toElement).closest("." + this.parent.components.PageElementSettings.prototype.CLASS.self).length) {

                    return;
                }

                if (!event.hover) {

                    this.blockHover = false;

                } else {

                    this.setHiddenByUser(false);
                }

                this.set("hover", event.hover && !this.Page.get("sortableActive"));
            });

            this.on("pageSectionTouchend", function (event, pageSection, touchmove) {

                if (this.hiddenByUser) {

                    var $target = $(event.original.target);

                    //nezobrazovat UI, pokud ho uživatel zavřel a tapnul na Element nebo Settings
                    if (!$target.closest("." + this.parent.components.PageElement.prototype.CLASS.self).length &&
                        !$target.closest("." + this.parent.components.PageSectionSettings.prototype.CLASS.self).length) {

                        this.blockTouchend = false;

                    } else {

                        this.blockHover = true;
                    }
                }

                if (this.blockTouchend) {

                    return;
                }

                this.blockHover = true;

                if (touchmove) {

                    return;
                }

                if (!this.get("hover")) {

                    this.set("hover", !this.Page.get("sortableActive"));

                    event.original.preventDefault();

                    if (!pageSection.get("hasSettings") && !pageSection.get("hasOutline")) {

                        EventEmitter.trigger("hover.PageSectionEditUI", [true, this]);
                    }
                }
            });
        },

        superOnrender: function () {

            this.self = this.find("." + this.CLASS.self);
            this.$self = $(this.self);
        },

        superOncomplete: function () {

        },

        superOnteardown: function () {

        },

        //uživatel tapnul na zavření UI
        hideEditUI: function (event) {

            this.set("hover", false);

            this.setHiddenByUser(true);
            this.blockTouchend = true;

            event.original.preventDefault();
            event.original.stopPropagation();

            this.Page.forEachEditor("saveSelection");

            this.$lastFocused = this.parent.get$SectionElement().find(":focus");
        },

        //po zavření UI je potřeba vrátit původní :focus a označení textu
        resetFocus: function () {

            if (this.$lastFocused) {

                this.Page.forEachEditor("restoreSelection");

                this.$lastFocused.focus();
            }

            this.blockHover = false;
        },

        setHiddenByUser: function (state) {

            this.hiddenByUser = state;

            this.self.classList[state ? "add" : "remove"](this.CLASS.hiddenByUser);
        }
     });

}));

