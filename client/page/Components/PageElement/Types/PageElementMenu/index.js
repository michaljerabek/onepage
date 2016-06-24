/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageElement = require("./../../"),
            Ractive = require("ractive"),

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
            {},
            {},
            root.Languages,
            root.U,
            {client: true}
        );
    }

}(this, function (PageElement, Ractive, components, partials, Languages, U, on) {

    var CLASS = {
        menuElement: "P_PageSectionMenu",
        fixed: "P_PageElement__menu-fixed",
        items: "P_PageElementMenu--items"
    };

    return PageElement.extend({

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

                //na iPadu nedostal element focus při tapnutí
                this.on("touchstart", function (event) {

                    if (!this.get("focus") || this.get("focusedElement") !== event.node) {

                        this.set("focusedElement", event.node);

                        this.placeCaretAtEnd(event.node);
                    }
                });
            }
        },

        checkText: function (currentValue, prevValue, path, item, lang) {

            if (this.skipTextObserver || this.removing) {

                return;
            }

            var inputValue = currentValue,

                moveCaret = 0;

            //odstranit počáteční mezery
            if (currentValue && currentValue.match(/^(?:\s+|\&nbsp\;)+/ig)) {

                currentValue = currentValue.replace(/^(?:\s+|\&nbsp\;)+/ig, "");

                moveCaret--;
            }

            if (currentValue && currentValue.match(/(<([^>]+)>)/ig)) {

                //nahradit <br> mezerou
                currentValue = currentValue.replace(/(\s{0}<(br[^>]+)>\s{0})/ig, " ");

                //odstranit všechny tagy
                currentValue = currentValue.replace(/(<([^>]+)>)/ig, "");
            }

            if (currentValue && currentValue.match(/(?:\&nbsp\;|\s)(?:\&nbsp\;|\s)+/ig)) {

                //dvě mezery nahradit jednou
                currentValue = currentValue.replace(/(?:\&nbsp\;|\s)(?:\&nbsp\;|\s)+/ig, " ");

                moveCaret--;
            }

            if (currentValue) {

                //omezit maximállní délku textu, $nbsp; je potřeba počítat jako 1 znak
                var nbsp = currentValue.match(/\&nbsp\;/ig),

                    length = currentValue.length - (nbsp ? nbsp.length * 5 : 0);

                if (length > this.MAX_LENGTH) {

                    currentValue = prevValue;

                    moveCaret--;
                }
            }

            if (currentValue !== inputValue) {

                var caret = this.getSelection().endOffset + moveCaret,
                    element = this.find(":focus");

                this.skipTextObserver = true;

                clearTimeout(this.fixTextTimeout);

                this.fixTextTimeout = setTimeout(function () {

                    this.skipTextObserver = true;

                    this.set("element.links." + item + ".text." + lang, currentValue);

                    try {

                        this.setCaretPosition(element, caret);

                    } catch (e) {

                        this.placeCaretAtEnd(element);
                    }

                    this.skipTextObserver = false;

                }.bind(this), 0);
            }
        },

        getSelection: function () {

            var savedRange;

            if (window.getSelection && window.getSelection().rangeCount > 0) {

                savedRange = window.getSelection().getRangeAt(0).cloneRange();

            } else if (document.selection) {

                savedRange = document.selection.createRange();
            }

            return savedRange;
        },

        setCaretPosition: function (node, pos) {

            if (!node) {

                return;
            }

            node.focus();

            var textNode = node.firstChild,
                range = document.createRange();

            range.setStart(textNode, pos);
            range.setEnd(textNode, pos);

            var sel = window.getSelection();

            sel.removeAllRanges();
            sel.addRange(range);
        },

        placeCaretAtEnd: function (node) {

            if (!node) {

                return;
            }

            node.focus();

            if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {

                var range = document.createRange();
                range.selectNodeContents(node);
                range.collapse(false);

                var sel = window.getSelection();

                sel.removeAllRanges();
                sel.addRange(range);

            } else if (typeof document.body.createTextRange !== "undefined") {

                var textRange = document.body.createTextRange();

                textRange.moveToElementText(node);
                textRange.collapse(false);
                textRange.select();
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
        },

        initObservers: function () {

            this.textObserver = this.observe("element.links.*.text.*", this.checkText, {init: false});

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

                this.set("element.blurBackgroundColor", generator.getBlackWhite(color));
            }
        },

        onteardown: function () {

            clearTimeout(this.skipFindActiveLinkTimeout);
            clearTimeout(this.fixTextTimeout);
            clearTimeout(this.completeTimeout);
            clearTimeout(this.fontChangedTimeout);

            Ractive.$win.off("." + this.EVENT_NS);

            this.EventEmitter
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

                var links = this.get("element.links") || [],

                    l = links.length - 1,

                    selector = [];

                for (l; l >= 0; l--) {

                    selector.unshift("[data-page-section-internal-id='" + links[l].link + "']");
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

            if (!this.get("element.links")) {

                this.set("element.links", [
                    {
                        link: "__section-14654025500600",
                        text: {
                            cs: "sdfsdf"
                        }
                    },
                    {
                        link: "__section-14643478567983",
                        text: {
                            cs: "sdfsdf"
                        }
                    },
                    {
                        link: "__section-14644596502321",
                        text: {
                            cs: "sdfsdf"
                        }
                    },
                    {
                        link: "__section-14644596496200",
                        text: {
                            cs: "sdfsdf"
                        }
                    },
                    {
                        link: "__section-14643478362410",
                        text: {
                            cs: "sdfsdf"
                        }
                    },
                    {
                        link: "__section-14643478368081",
                        text: {
                            cs: "sdfsdf"
                        }
                    }
                ]);
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

