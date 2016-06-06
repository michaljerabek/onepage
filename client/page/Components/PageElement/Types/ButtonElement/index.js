/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageElement = require("./../../"),
            Ractive = require("ractive"),

            U = require("./../../../../../libs/U"),
            EventEmitter = require("./../../../../../libs/EventEmitter")(),
            on = require("./../../../../../../helpers/on"),

            partials = {
                pageElementEditUI: require("./edit-ui.tpl"),
                pageElementContent: require("./index.tpl")
            };

        module.exports = factory(
            PageElement,
            EventEmitter,
            Ractive,
            U,
            partials,
            on
        );

    } else {

        root.ButtonElement = factory(
            root.PageElement,
            root.EventEmitter,
            root.Ractive,
            root.U,
            {},
            {client: true}
        );
    }

}(this, function (PageElement, EventEmitter, Ractive, U, partials, on) {

    return PageElement.extend({

        getNewItem: function () {

            var lang = this.get("lang"),

                button = {
                    text: {}
                };

            button.text[lang] = "Tlačítko";

            return button;
        },

        hasEditor: false,

        MAX_LENGTH: 48,
        MAX_LENGTH_NO_ICON: 56,

        MIN_TEXT_CONTRAST: 5,

        components: {
        },

        partials: partials,

        data: function () {

            return {
                type: "button",
                hasEditUI: true,
                transitionName: "slidevh"
            };
        },

        onconfig: function () {

            this.CLASS.text = "P_ButtonElement--text";
            this.CLASS.icon = "P_ButtonElement--icon";

            this.superOnconfig();

            if (Ractive.EDIT_MODE) {

                if (on.client) {

                    EventEmitter.on("saving:lang:start.Page." + this.EVENT_NS, function () {

                        this.skipTextObserver = true;

                    }.bind(this));

                    EventEmitter.on("saving:lang:end.Page." + this.EVENT_NS, function () {

                        this.skipTextObserver = false;

                    }.bind(this));
                }
            }

            this.PageSection = this.getPageSection();

            this.Page = this.findParent("Page");

            //při ukládání stránky se přeřazují elementy, což způsobí jejich odstranění a znovuvytvoření,
            //proto je potřeba transitions vypnout
            if (this.Page.saving) {

                this.set("stopTransition", true);
            }
        },

        onrender: function () {

            this.superOnrender();

            this.$text = this.$self.find("." + this.CLASS.text);

            this.setDefaultValues();

            if (Ractive.EDIT_MODE) {

                this.on("stateChange", function (state) {

                    if (state && (this.hasFocusedElement() || this.focusin)) {

                        this.set("state", "active");

                    } else {

                        this.set("state", "inactive");
                    }
                });

                this.initObservers();

                //na iPadu nedostal element focus při tapnutí
                this.on("touchstart", function () {

                    if (!this.get("focus")) {

                        this.placeCaretAtEnd(this.$text[0]);
                    }
                });

            } else {

                this.$text.balanceText();
            }
        },

        oncomplete: function () {

            this.superOncomplete();

            if (Ractive.EDIT_MODE) {

                this.balanceText();
            }
        },

        setDefaultValues: function () {

            if (!this.get("element.type")) {

                this.set("element.type", "button");
            }

        },

        initObservers: function () {

            this.linkObserver = this.observe("element.link", this.setIconForLink);

            this.iconObserver = this.observe("element.icon", function () {

                this.balanceText(400, this.get("lang"));

            }, {init: false});

            this.fillObserver = this.observe("element.fill", function (state) {

                this.PageSection.set("stopColorTransitions", false);

                var generator = this.Page.defaultColorsGenerator,

                    color = this.get("element.color") || this.get("defaultColors.specialColor");

                if (generator && color) {

                    this.set("element.textColor", state ? generator.getBlackWhite(color, this.MIN_TEXT_CONTRAST, true) : null);
                }

            }, {init: false});

            this.colorObserver = this.observe("element.color", function (color) {

                var generator = this.Page.defaultColorsGenerator;

                if (this.get("element.fill") && generator) {

                    this.set("element.textColor", generator.getBlackWhite(color || this.get("defaultColors.specialColor"), this.MIN_TEXT_CONTRAST, true));
                }
            }, {init: false});

            this.defColorObserver = this.observe("defaultColors.specialColor", function (color) {

                var generator = this.Page.defaultColorsGenerator;

                if (this.get("element.fill") && generator && color && !this.get("element.color")) {

                    this.set("element.textColor", generator.getBlackWhite(color, this.MIN_TEXT_CONTRAST, true));
                }
            }, {init: false});

            this.textObserver = this.observe("element.text.*", this.checkText, {init: false});
        },

        cancelObservers: function () {

            if (this.textObserver) {

                this.linkObserver.cancel();
                this.fillObserver.cancel();
                this.iconObserver.cancel();
                this.colorObserver.cancel();
                this.defColorObserver.cancel();
                this.textObserver.cancel();
            }
        },

        onteardown: function () {

            this.cancelObservers();

            if (Ractive.EDIT_MODE) {

                if (on.client) {

                    EventEmitter.off("." + this.EVENT_NS);
                }
            }

            clearTimeout(this.fixTextTimeout);

            this.superOnteardown();
        },

        checkText: function (currentValue, prevValue, path, lang) {

            if (this.skipTextObserver) {

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

                if (length > (this.get("element.icon") ? this.MAX_LENGTH : this.MAX_LENGTH_NO_ICON)) {

                    currentValue = prevValue;
                }
            }

            if (currentValue !== inputValue) {

                var caret = this.getSelection().endOffset + moveCaret;

                this.skipTextObserver = true;

                clearTimeout(this.fixTextTimeout);

                this.fixTextTimeout = setTimeout(function () {

                    this.skipTextObserver = true;

                    this.set("element.text." + lang, currentValue);

                    try {

                        this.setCaretPosition(this.$text[0], caret);

                    } catch (e) {

                        this.placeCaretAtEnd(this.$text[0]);
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

            node.focus();

            var textNode = node.firstChild,
                range = document.createRange();

            range.setStart(textNode, pos);
            range.setEnd(textNode, pos);

            var sel = window.getSelection();

            sel.removeAllRanges();
            sel.addRange(range);
        },

        setIconForLink: function (value) {

            if (value) {

                //email
                if (value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {

                    this.set("element.icon", "<svg><use xlink:href='#icon-email'></use></svg>");

                //iOS aplikace
                } else if (value.match(/^\s*(?:https?:\/\/)?(?:www\.)?itunes\.apple\.com\/[a-zA-Z0-9\-]+\/app/i)) {

                    this.set("element.icon", "<svg style='margin-top: -1px;'><use xlink:href='#icon-apple'></use></svg>");

                //Android aplikace
                } else if (value.match(/^\s*(?:https?:\/\/)?(?:www\.)?play\.google\.com\/store\/apps/i)) {

                    this.set("element.icon", "<svg><use xlink:href='#icon-android'></use></svg>");

                //Windows aplikace
                } else if (value.match(/^\s*(?:https?:\/\/)?(?:www\.)?(?:windowsphone|microsoft)\.com\/[a-zA-Z0-9\-]+\/store\/apps/i)) {

                    this.set("element.icon", "<svg><use xlink:href='#icon-windows'></use></svg>");

                //Stahovatelný soubor
                } else if (value.match(/^(?=[^@]+)\.(?=[a-zA-Z0-9]+$)(?=(?!html$|htm$|php$|py$|asp$))/i)) {

                    this.set("element.icon", "<svg><use xlink:href='#icon-download'></use></svg>");

                } else {

                    this.set("element.icon", null);
                }

            } else if (!this.get("element.download")) {

                this.set("element.icon", null);

            //Stahovatelný soubor
            } else {

                this.set("element.icon", "<svg><use xlink:href='#icon-download'></use></svg>");
            }
        },

        removeIfEmpty: function () {

            var empty = (this.get("element.text." + this.get("lang")) || "").replace(/(?:<[^>]*>)/g, "").match(/^(\s|\&nbsp\;)*$/);

            if (empty) {

                clearTimeout(this.balanceTextTimeout);

                clearTimeout(this.fixTextTimeout);

                if (this.removing) {

                    return;
                }

                this.fire("removeButton", {}, this.get("element"), this);

            } else {

                this.balanceText();
            }
        },

        balanceText: function (timeout, lang) {

            clearTimeout(this.balanceTextTimeout);

            if (this.removing) {

                return;
            }

            this.balanceTextTimeout = setTimeout(function () {

                this.$text.balanceText();

                this.skipTextObserver = true;

                this.set("element.text." + (lang || this.get("lang")), this.$text.html());

                this.skipTextObserver = false;

            }.bind(this), timeout || 0);
        },

        placeCaretAtEnd: function (el) {

            el.focus();

            if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {

                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);

                var sel = window.getSelection();

                sel.removeAllRanges();
                sel.addRange(range);

            } else if (typeof document.body.createTextRange !== "undefined") {

                var textRange = document.body.createTextRange();

                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }
        },

        action: function (event, editMode) {

            if (!editMode || (event.original.srcEvent || event.original).ctrlKey) {

                var link    = this.get("element.link")    || "",
                    product = this.get("element.product") || "",

                    type = this.get("element.type");

                if (type !== "button") {

                    if (link && this.Page.scrollToSection.isInternalId(link.replace(/^#/, ""))) {

                        this.Page.scrollToSection.scrollToSectionById(link.replace(/^#/, ""));

                    } else if (link) {

                        var target = "_blank";

                        //pokud je odkaz email -> přidat mailto:
                        if (link.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {

                            link = "mailto:" + link;

                            target = null;
                        }

                        window.open(link, target);
                    }

                } else {

                    if (this.get("element.scrollToSection")) {

                        this.Page.scrollToSection.scrollToSectionById(this.get("element.section"));
                    }

                    if (this.get("element.addToCart")) {

                    }

                    if (this.get("element.download")) {

                        window.open(this.get("element.file"));
                    }

                }

            }
        }
    });

}));

