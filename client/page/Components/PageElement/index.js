/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            PageElementSettings = require("./PageElementSettings"),

            U = require("./../../../libs/U"),
            EventEmitter = require("./../../../libs/EventEmitter")(),
            on = require("./../../../../helpers/on");

        module.exports = factory(
            Ractive,
            PageElementSettings,
            U,
            require("./index.tpl"),
            EventEmitter,
            on
        );

    } else {

        root.PageElement = factory(
            root.Ractive,
            root.PageElementSettings,
            root.U,
            "",
            $([]),
            {client: true}
        );
    }

}(this, function (Ractive, PageElementSettings, U, template, EventEmitter, on) {

    var instanceCounter = 0,

        hasMouseTouchStyles = false,

        hoverByTouchend = false,

        hoverByTouchendTimeout = null,

        throttleHoverByTouchend = function () {

            hoverByTouchend = true;

            clearTimeout(hoverByTouchendTimeout);

            hoverByTouchendTimeout = setTimeout(function() {

//                hoverByTouchend = false;

            }, 100);
        };

    return Ractive.extend({

        PAGE_ELEMENT: true,

        template: template,

        CLASS: {
            self: "P_PageElement",

            outline: "E_PageElement--outline",
            outlineActive: "E_PageElement--outline__active"
        },

        components: {
            PageElementSettings: PageElementSettings
        },

        partials: {
            pageElementEditUI: "",
            pageElementContent: ""
        },

        data: function () {

            return {
                hover: false
            };
        },

        superOnconfig: function () {

            this.EVENT_NS = "PageElement-" + (++instanceCounter);

            if (on.client) {

                Ractive.$win = Ractive.$win || $(window);

                this.$temp = $([null]);
            }

            this.initPageElementSettings();
        },

        initPageElementSettings: function () {

            if (on.client) {

                //otevírá se nastavení elementu v sekci -> zavřít nastavení v ostatních sekcích
                EventEmitter.on("openPageElementSettings.PageElement sortPageSection.PageSectionManager", function (e, pageSectionType) {

                    if (pageSectionType !== this) {

                        this.togglePageElementSettings(false);
                    }
                }.bind(this));
            }

            //uživatel otevírá nastavení elementu v sekci
            this.on("openPageElementSettings", function (event, type) {

                this.set("pageElementSettingsPositionElement", event.node);

                type = type === this.get("openPageElementSettings") ? false : type;

                this.togglePageElementSettings(type);

                if (type) {

                    EventEmitter.trigger("openPageElementSettings.PageElement", this);
                }
            });

            //Uživatel kliknul na "zavřít" v nastavení.
            this.on("PageElementSettings.closeThisSettings", this.togglePageElementSettings.bind(this, false));
        },

        superOnrender: function () {

            if (on.client) {

                this.self = this.find("." + this.CLASS.self);
                this.$self = $(this.self);

                this.initOutline();
            }
        },

        initOutline: function () {

            this.outlineElement = this.find("." + this.CLASS.outline);

            //pokud uživatel přestane editovat text, je nutné zjistit, jestli má outline zmizet
            this.$self.on("focusout." + this.EVENT_NS, function () {

                clearTimeout(this.focusoutTimeout);

                this.focusoutTimeout = setTimeout(this.updateOutlineState.bind(this), 100);

            }.bind(this));

            //při najetí myší zbrazit outline
            this.observe("hover", function (state) {

                if (!hoverByTouchend) {

                    this.fire("pageElementHover", this, state);
                }

                this.updateOutlineState();

                if (!state) {

                    this.set("restoreHover", false);
                }

            }, {init: false});

            //při najetí na vnitřní outline je potřeba ostatní odstranit
            this.on("*.pageElementHover", function (element, state) {

                if (element === this) {

                    return;
                }

                if (state) {

                    this.set("hover", false);

                    //je potřeba uložit stav - až uživatel odjede z vnitřního elementu, outline se vrátí
                    this.set("restoreHover", true);

                } else {

                    this.set("hover", this.get("restoreHover"));
                }
            });
        },

        superOncomplete: function () {

        },

        superOnteardown: function () {

            clearTimeout(this.focusoutTimeout);

            this.$self.off("." + this.EVENT_NS);
        },

        handleTouchend: function (e) {

            if (this.get("hover")) {

                return;
            }

            throttleHoverByTouchend();

            this.set("hover", true);

            this.setMouseTouchStyles(false);

            Ractive.$win
                .off("touchend.hover-" + this.EVENT_NS)
                .on( "touchend.hover-" + this.EVENT_NS, function (e) {

                    throttleHoverByTouchend();

                    this.$temp[0] = e.target;

                    if (this.$temp.closest("." + this.CLASS.self)[0] !== this.self) {

                        this.set("hover", false);

                        Ractive.$win.off("touchend.hover-" + this.EVENT_NS);
                    }

                }.bind(this));

            e.original.preventDefault();
        },

        handleHover: function (event) {

            if (hoverByTouchend) {

                return;
            }

            this.setMouseTouchStyles(true);

            this.set('hover', event.hover);
        },

        updateOutlineState: function () {

            var state = (this.get("hover") || this.get("openPageElementSettings") || this.hasFocusedEditor());

            this.outlineElement.classList[state ? "add" : "remove"](this.CLASS.outlineActive);
        },

        hasFocusedEditor: function () {

            var editors = this.findAll("[data-medium-focused='true']"),
                e = editors.length - 1;

            for (e; e >= 0; e--) {

                this.$temp[0] = editors[e];

                if (this.$temp.closest("." + this.CLASS.self)[0] === this.self) {

                    return true;
                }
            }

            return false;
        },

        setMouseTouchStyles: function (isMouseUsed) {

            if (isMouseUsed) {

                if (hasMouseTouchStyles) {

                    return;
                }

                var cssText = [
                    ".csspointerevents ." + this.CLASS.outline + "{ ",
                        "pointer-events: none;",
                    "}"
                ].join("");

                $("<style />")
                    .attr("id", "PageElement--mouse-touch")
                    .html(cssText)
                    .appendTo("head");

                hasMouseTouchStyles = true;

                return;
            }

            $("#PageElement--mouse-touch").remove();

            hasMouseTouchStyles = false;
        },


        togglePageElementSettings: function (state) {

            this.set("openPageElementSettings", state);

            this.updateOutlineState();
        }

    });

}));

