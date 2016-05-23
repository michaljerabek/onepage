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

    /*
     * Abstraktní (!) component pro vytváření editovatelných prvků na stránce.
     * Přídá outline a nastavovací tlačítka -> řízeno konkrétními komponenty.
     *
     * Konkrétní typ musí obsahovat data "type" označující typ PageElementu,
     * data "hasEditUI" označující, jestli má ovládací prvky a může obsahovat
     * "settingsTitle" nastavující titulek PageElementSettings.
     *
     * Konkrétní typ může obsahovat metodu isEmpty, která zjistí, jestli je element prázdný (Přidá se třída E_PageElement__empty).
     *
     * Konkrétní typ může nastavovat stav PageElementu nastavením vlastnosti "state", která by měla vycházet z
     * události "stateChange".
     */

    var instanceCounter = 0,

        hasMouseTouchStyles = false,

        //nastaví chování outlinu
        //Outline se zobrazuje nad obsahem, proto je potřeba mu přidat pointer-events: none.
        //Na dotykových zařízeních se nastaví po touchstart na konkrétním elementu (v styles.css),
        //při použití myši se nastaví pro všechny.
        setMouseTouchStyles = function (isMouseUsed) {

            if (isMouseUsed) {

                if (hasMouseTouchStyles) {

                    return;
                }

                var cssText = [
                    ".E_PageElement--outline { ",
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

            if (hasMouseTouchStyles) {

                $("#PageElement--mouse-touch").remove();

                hasMouseTouchStyles = false;
            }
        },

        hoverByTouch = false,
        hoverByTouchTimeout = null,

        throttleHoverByTouch = function () {

            hoverByTouch = true;

            clearTimeout(hoverByTouchTimeout);

            hoverByTouchTimeout = setTimeout(function() {

                hoverByTouch = false;

                setMouseTouchStyles(false);

                //Pokud se opět použije touchstart -> použít stylování pro dotyk. z.
                Ractive.$win
                    .off("touchstart.PageElement")
                    .one("touchstart.PageElement", function () {

                    setMouseTouchStyles(false);

                    hoverByTouch = true;

                }.bind(this));

            }, 5000);
        };

    return Ractive.extend({

        PAGE_ELEMENT: true,

        template: template,

        CLASS: {
            self: "P_PageElement",

            outline: "E_PageElement--outline", //při změně změnit i výše v "setMouseTouchStyles()"
            outlineActive: "E_PageElement--outline__active"
        },

        components: {
            PageElementSettings: Ractive.EDIT_MODE ? PageElementSettings : null
        },

        partials: {
            pageElementEditUI: "",
            pageElementContent: ""
        },

        data: function () {

            return {
                hover: false,
                editMode: Ractive.EDIT_MODE
            };
        },

        superOnconfig: function () {

            this.EVENT_NS = "PageElement-" + (++instanceCounter);

            if (on.client) {

                Ractive.$win = Ractive.$win || $(window);

                this.$temp = $([null]);

                if (Ractive.EDIT_MODE) {

                    //umožnit otevřít nastavení elementu
                    this.initPageElementSettings();
                }
            }
        },

        initPageElementSettings: function () {

            if (on.client) {

                //otevírá se nastavení elementu v sekci -> zavřít nastavení v ostatních sekcích
                EventEmitter.on("openPageElementSettings.PageElement sortPageSection.PageSectionManager", function (e, state, pageSectionType) {

                    if (pageSectionType !== this) {

                        this.togglePageElementSettings(false);
                    }
                }.bind(this));
            }

            //uživatel otevírá nastavení elementu v sekci
            this.on("openPageElementSettings", function (event, type) {

                //element pro určení pozice nastavení
                this.set("pageElementSettingsPositionElement", event.node);

                type = type === this.get("openPageElementSettings") ? false : type;

                this.togglePageElementSettings(type);

                EventEmitter.trigger("openPageElementSettings.PageElement", [type, this]);
            });

            //Uživatel kliknul na "zavřít" v nastavení.
            this.on("PageElementSettings.closeThisSettings", function () {

                this.togglePageElementSettings(false);

                EventEmitter.trigger("openPageElementSettings.PageElement", [false, this]);

            }.bind(this));
        },

        superOnrender: function () {

            if (on.client) {

                this.self = this.find("." + this.CLASS.self);
                this.$self = $(this.self);

                if (Ractive.EDIT_MODE) {

                    this.initOutline();
                }
            }
        },

        //spustí zobrazování ui při najetí myší
        initOutline: function () {

            this.outlineElement = this.find("." + this.CLASS.outline);

            this.$self
                //pokud uživatel přestane editovat text, je nutné zjistit, jestli má outline zmizet
                .on("focusout." + this.EVENT_NS, function () {

                    this.set("hover", false);

                    this.fire("stateChange", this.get("showOutline"));

                    clearTimeout(this.focusoutTimeout);

                    this.focusoutTimeout = setTimeout(this.updateOutlineState.bind(this), 100);

                }.bind(this))
                //zobrazit outline např při tabu nebo označení
                .on("focusin." + this.EVENT_NS, function (e) {

                    //pouze nejvnitřnější elmenet
                    var children = this.findAllComponents(),

                        i = children.length - 1;

                    for (i; i >= 0; i--) {

                        if (children[i].PAGE_ELEMENT && children[i].focusin) {

                            return;
                        }
                    }

                    this.set("hover", true);

                    this.focusin = true;

                    this.fire("stateChange", this.get("showOutline"));

//                    e.stopPropagation();

                }.bind(this));

            //při najetí myší zbrazit outline
            this.observe("hover", function (state) {

                if (!hoverByTouch) {

                    //pro případné odstranění vnějších hover stavů
                    this.fire("pageElementHover", state);
                }

                this.updateOutlineState();

                if (!state) {

                    this.focusin = false;

                    this.set("restoreHover", false);

                    if (hoverByTouch) {

                        Ractive.$win.off("touchstart.hover-" + this.EVENT_NS);
                    }
                }
            }, {init: false});

            //při najetí na vnitřní outline je potřeba ostatní odstranit
            this.on("*.pageElementHover", function (state) {

                if (state) {

                    this.set("hover", false);

                    this.fire("stateChange", this.get("showOutline"));

                    //je potřeba uložit stav - až uživatel odjede z vnitřního elementu, outline se vrátí
                    this.set("restoreHover", true);

                } else {

                    if (!this.hasChildPageElementHoverState()) {

                        var restore = this.get("restoreHover");

                        this.set("hover", restore);

                        this.fire("stateChange", this.get("showOutline"));
                    }
                }
            });
        },

        superOncomplete: function () {

        },

        superOnteardown: function () {

            clearTimeout(this.focusoutTimeout);

            this.$self.off("." + this.EVENT_NS);

            Ractive.$win
                .off("touchstart.hover-" + this.EVENT_NS)
                .off("touchstart.PageElement");
        },

        handleTouchstart: function (event) {

            throttleHoverByTouch();

            if (event.original.touches.length > 1 || this.get("hover")) {

                return;
            }

            this.touchstartTime = +new Date();
            this.cancelTouchend = false;

            var initX = event.original.touches[0].pageX,
                initY = event.original.touches[0].pageY;

            Ractive.$win
                .off("touchstart.hover-" + this.EVENT_NS)
                .on( "touchmove.hover-" + this.EVENT_NS, function (event) {

                    this.cancelTouchend = Math.abs(initX - event.originalEvent.touches[0].pageX) > 5 ||
                        Math.abs(initY - event.originalEvent.touches[0].pageY) > 5;

                }.bind(this))
                .on( "touchstart.hover-" + this.EVENT_NS, function (event) {

                    throttleHoverByTouch();

                    this.hideOutlineTouches = event.originalEvent.touches.length;

                    clearTimeout(this.hideOutlineTimeout);

                    this.hideOutlineTimeout = setTimeout(function() {

                        if (this.hideOutlineTouches > 1) {

                            return;
                        }

                        this.$temp[0] = event.target;

                        //uživatel tapnul na jiný vnitřní/vnější element (nebo úplně jinam)
                        if (this.$temp.closest("." + this.CLASS.self)[0] !== this.self) {

                            this.set("hover", false);

                            this.fire("stateChange", this.get("showOutline"));

                            Ractive.$win.off("touchstart.hover-" + this.EVENT_NS);
                        }

                    }.bind(this), 50);

                }.bind(this));
        },

        handleTouchend: function (event) {

            throttleHoverByTouch();

            Ractive.$win
                .off("touchmove.hover-" + this.EVENT_NS);

            if (this.cancelTouchend || !this.touchstartTime || event.original.touches.length > 1 || this.get("hover")) {

                return;
            }

            this.set("hover", true);

            this.fire("stateChange", this.get("showOutline"));

            var touchendTime = +new Date();

            //pokud uživatel drží prst na elmentu méně než 500ms, needitovat text - pouze zobrazit ui
            if (touchendTime - this.touchstartTime < 500) {

                event.original.preventDefault();
            }

            this.touchstartTime = 0;
        },

        handleHover: function (event) {

            if (hoverByTouch) {

                return;
            }

            setMouseTouchStyles(true);

            this.set("hover", event.hover);
        },

        //zobrazí ui, pokud je stav "hover" nebo je otevřeno nastavení nebo má Editor focus,
        //jinak ui skryje
        updateOutlineState: function () {

            var state = (this.get("hover") || this.get("openPageElementSettings") || this.hasFocusedEditor());

            this.set("showOutline", state);

            this.checkOutlineSize(state);

            this.fire("sectionHasOutline", state);

            this.fire("stateChange", !!state);
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

        hasChildPageElementHoverState: function () {

            var components = this.findAllComponents(),
                c = components.length - 1;

            for (c; c >= 0; c--) {

                if (components[c].PAGE_ELEMENT && components[c].get("hover")) {

                    return true;
                }
            }

            return false;
        },

        togglePageElementSettings: function (state) {

            this.set("openPageElementSettings", state);

            this.updateOutlineState();
        },

        //pokud outline přesahuje velikost okna, je ptřeba ho změnšit
        checkOutlineSize: function (state) {

            if (!state) {

                this.set("limitSize", false);
            }

            var rect = this.outlineElement.getBoundingClientRect(),

                viewportWidth = U.viewportWidth();


            if (rect.left < 0 || rect.right > viewportWidth) {

                this.set("limitSize", true);
            }
        }
    });

}));

