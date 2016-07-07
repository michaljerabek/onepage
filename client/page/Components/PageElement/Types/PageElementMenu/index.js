/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageElement = require("./../../"),
            Ractive = require("ractive"),

            TextCleaner = require("./../../TextCleaner"),

            on =        require("./../../../../../../helpers/on"),
            U =         require("./../../../../../libs/U"),
            Languages = require("./../../../../../libs/Languages.js"),

            partials = {
                pageElementEditUI: require("./edit-ui.tpl"),
                pageElementContent: require("./index.tpl")
            },

            components = {
                PageElementLogo: require("./../PageElementLogo")
            };

        module.exports = factory(
            PageElement,
            Ractive,
            TextCleaner,
            components,
            partials,
            Languages,
            U,
            on
        );

    } else {

        root.PageElementMenu = factory(
            root.PageElement,
            root.Ractive,
            root.TextCleaner,
            {},
            {},
            root.Languages,
            root.U,
            {client: true}
        );
    }

}(this, function (PageElement, Ractive, TextCleaner, components, partials, Languages, U, on) {

    var CLASS = {
        menuElement: "P_PageSectionMenu",
        fixed: "P_PageElement__menu-fixed",
        items: "P_PageElementMenu--items",
        hasSettings: "E_PageElementMenu__has-settings"
    };

    return PageElement.extend({

        COLORABLE: true,

        MIN_TEXT_CONTRAST: 5,

        MAX_LENGTH: 20,

        components: components,

        partials: partials,

        data: function () {

            return {
                type: "menu",
                hasEditUI: true,
                settingsTitle: "Nastavení hlavního menu",
                languages: Languages
            };
        },

        onconfig: function () {

            this.superOnconfig();

            this.setDefaultValues();

            if (Ractive.EDIT_MODE) {

                this.textCleaner = new TextCleaner(this, this.MAX_LENGTH);

                this.observe("openPageElementSettings", function (current, prev) {

                    if (current === "settings") {

                        this.set("restoreFill", !this.get("element.fill"));

                        this.set("element.fill", true);

                    } else if (prev === "settings" && this.get("restoreFill")) {

                        this.set("restoreFill", false);
                        this.set("element.fill", false);
                    }

                }, {init: false});

                //na iPadu nedostal element focus při tapnutí
                this.on("touchstart", function (event) {

                    if (!this.get("focus") || this.get("focusedElement") !== event.node) {

                        this.set("focusedElement", event.node);

                        TextCleaner.placeCaretAtEnd(event.node);
                    }
                });
            }
        },

        onrender: function () {

            this.superOnrender();

            this.initObservers();

            if (!Ractive.EDIT_MODE) {

                Ractive.$win.on("scroll." + this.EVENT_NS, this.handleScroll.bind(this));
            }

            this.itemsElement = this.find("." + CLASS.items);

            Ractive.$win.on("resize." + this.EVENT_NS, this.checkMenuOverflow.bind(this));

            this.checkMenuOverflow();

            this.EventEmitter.on("langChanged.Page." + this.EVENT_NS, function (e, lang, editMode, promise) {

                promise.then(this.checkMenuOverflow.bind(this));

            }.bind(this));

            this.EventEmitter.on("fontChanged.Page." + this.EVENT_NS, function () {

                clearTimeout(this.fontChangedTimeout);

                this.fontChangedTimeout = setTimeout(this.checkMenuOverflow.bind(this), 300);

            }.bind(this));

            this.EventEmitter
                .on("addToMenuChanged.PageSection." + this.EVENT_NS, this.updateLinks.bind(this))
                .on("sectionRemoved.PageSectionManager." + this.EVENT_NS, this.updateLinks.bind(this))
                .on("sectionOrderChanged.PageSectionManager." + this.EVENT_NS, this.updateLinks.bind(this));

            this.observe("openPageElementSettings", function (state) {

                this.set("specialClass1", state ? CLASS.hasSettings : "");

            }, {init: false});

            if (Ractive.EDIT_MODE && on.client) {

                if (!this.get("element.blurBackgroundColor")) {

                    this.completeTimeout = setTimeout(this.findBlurBackgroundColor.bind(this), 0);
                }
            }

            if (!this.get("element.hidden")) {

                this.checkMenuOverflow();
            }

            this.fixMenu();

            this.findActiveLink();
        },

        initObservers: function () {

            this.textObserver = this.observe("links.*.menuText.*", function () {

                if (this.Page.saving) {

                    return;
                }

                this.fire("pageChange");

                this.textCleaner.observer.apply(this, arguments);

            }, {init: false});

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

            this.textColorObserver = this.observe("textColor defaultColors.textColor", this.findBlurBackgroundColor, {init: false});

        },

        oncomplete: function () {

            this.superOncomplete();

        },

        checkMenuOverflow: function () {

            if (window.innerWidth < 1440) {

                return;
            }

            if (this.get("element.hidden")) {

                this.set("element.hidden", false).then(function () {

                    if (this.itemsElement.scrollWidth > this.itemsElement.offsetWidth) {

                        this.set("element.hidden", true);
                    }

                }.bind(this));

            } else {

                if (this.itemsElement.scrollWidth > this.itemsElement.offsetWidth) {

                    this.set("element.hidden", true);
                }
            }
        },

        findBlurBackgroundColor: function() {

            var generator = this.Page.defaultColorsGenerator,

                color = this.get("textColor") || this.get("defaultColors.textColor");

            if (color) {

                this.set("element.blurBackgroundColor", generator.getBlackWhite(color, null, false, true));
            }
        },

        onteardown: function () {

            clearTimeout(this.updateLinksTimeout);
            clearTimeout(this.checkMenuOverflowTimeout);
            clearTimeout(this.skipFindActiveLinkTimeout);
            clearTimeout(this.fixTextTimeout);
            clearTimeout(this.completeTimeout);
            clearTimeout(this.fontChangedTimeout);

            Ractive.$win.off("." + this.EVENT_NS);

            this.EventEmitter
                .off("sectionOrderChanged.PageSectionManager." + this.EVENT_NS)
                .off("sectionRemoved.PageSectionManager." + this.EVENT_NS)
                .off("addToMenuChanged.PageSection." + this.EVENT_NS)
                .off("orderChanged.Page." + this.EVENT_NS)
                .off("langChanged.Page." + this.EVENT_NS)
                .off("fontChanged.Page." + this.EVENT_NS);

            this.superOnteardown();

            if (this.defPaletteObserver) {

                this.textObserver.cancel();
                this.defPaletteObserver.cancel();
                this.fillObserver.cancel();
                this.backgroundColorObserver.cancel();
                this.textColorObserver.cancel();
            }
        },

        handleScroll: function () {

            this.fixMenu();

            this.findActiveLink(!this.Page.scrollToSection.isScrolling());
        },

        fixMenu: function () {

            if (Ractive.$win.scrollTop() > 0) {

                if (!this.isFixed) {

                    this.isFixed = true;
                    this.set("fixed", true);
                    this.set("specialClass1", CLASS.fixed);
                }

            } else {

                if (this.isFixed) {

                    this.isFixed = false;
                    this.set("fixed", false);
                    this.set("specialClass1", "");
                }
            }
        },

        findActiveLink: function (skipCheckLocation) {

            if (this.skipFindActiveLink) {

                clearTimeout(this.skipFindActiveLinkTimeout);

                this.skipFindActiveLinkTimeout = setTimeout(function() {

                    this.skipFindActiveLink = false;

                }.bind(this), 250);

                return;
            }

            if (skipCheckLocation !== true) {

                if (~window.location.hash.indexOf("#")) {

                    var sectionEl = this.Page.find("[id='" + window.location.hash.replace("#", "") + "']");

                    if (sectionEl) {

                        this.set("activeLink", sectionEl.getAttribute("data-page-section-internal-id"));

                        this.skipFindActiveLink = true;

                        return;
                    }
                }
            }

            if (!this.sectionsCache) {

                var links = this.get("links") || [],

                    l = links.length - 1,

                    selector = [];

                for (l; l >= 0; l--) {

                    selector.unshift("[data-page-section-internal-id='" + links[l].internalId + "']");
                }

                if (!selector.length) {

                    return;
                }

                this.sectionsCache = this.Page.findAll(selector.join(","));
            }

            var s = 0,

                closestSection = -1,
                lastTop = null;

            for (s; s < this.sectionsCache.length; s++) {

                var section = this.sectionsCache[s],

                    rect = section.getBoundingClientRect();

                if (rect.top < window.innerHeight / 4 && rect.bottom > 0 && (lastTop === null || rect.top > lastTop)) {

                    lastTop = rect.top;

                    closestSection = s;
                }
            }

            if (~closestSection) {

                this.set("activeLink", this.sectionsCache[closestSection].getAttribute("data-page-section-internal-id"));

            } else {

                this.set("activeLink", "");
            }
        },

        setDefaultValues: function () {

            var links = [];

            (this.Page.get("page.sections") || []).forEach(function (section) {

                if (section.addToMenu) {

                    links.push(section);
                }
            });

            this.set("links", links);
        },

        removeIfEmpty: function (id, text) {

            if (!text || !!text.replace(/(?:<[^>]*>)/g, "").match(/^(\s|\&nbsp\;)*$/)) {

                var menu = this;

                this.Page.forEachPageSection(function () {

                    if (this.get("section.internalId") === id) {

                        this.set("section.addToMenu", false);
                        this.set("section.menuText", undefined);

                        menu.updateLinks();

                        return false;
                    }
                });
            }
        },

        updateLinks: function () {

            clearTimeout(this.checkMenuOverflowTimeout);
            clearTimeout(this.updateLinksTimeout);

            this.updateLinksTimeout = setTimeout(function() {

                var links = [];

                this.Page.forEachPageSectionByIndex(function () {

                    if (this.get("section.addToMenu")) {

                        links.unshift(this.get("section"));
                    }
                });

                this.merge("links", links);

                clearTimeout(this.checkMenuOverflowTimeout);

                this.checkMenuOverflowTimeout = setTimeout(this.checkMenuOverflow.bind(this), 400);

            }.bind(this), 0);
        },

        removeColorRefs: function () {

            var element = this.get("element");

            element.textColorRef = null;
            element.backgroundColorRef = null;
            element.textColor = "";
            element.backgroundColor = "";
            element.autoTextColor = "";

            this.update("element");
        },

        action: function (event, link, editMode) {

            if (!editMode) {

                this.set("activeLink", link);
            }

            if (editMode && (event.original.srcEvent || event.original).ctrlKey) {

                (event.original.srcEvent || event.original).preventDefault();
                (event.original.srcEvent || event.original).stopPropagation();

                if (link && this.Page.scrollToSection.isInternalId(link.replace(/^#/, ""))) {

                    this.Page.scrollToSection.scrollToSectionById(link.replace(/^#/, ""));
                }
            }
        }
    });

}));

