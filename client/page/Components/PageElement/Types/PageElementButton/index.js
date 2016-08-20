/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageElement = require("./../../"),
            Ractive = require("ractive"),
            TextCleaner = require("./../../TextCleaner"),

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
            TextCleaner,
            U,
            partials,
            on
        );

    } else {

        root.PageElementButton = factory(
            root.PageElement,
            root.EventEmitter,
            root.Ractive,
            root.TextCleaner,
            root.U,
            {},
            {client: true}
        );
    }

}(this, function (PageElement, EventEmitter, Ractive, TextCleaner, U, partials, on) {

    return PageElement.extend({

        getNewItem: function () {

            var lang = this.get("lang"),

                button = {
                    text: {}
                };

            button.text[lang] = "Tlačítko";

            return button;
        },

        COLORABLE: true,

        hasEditor: false,

        MAX_LENGTH: 48,
        MAX_LENGTH_NO_ICON: 56,

        MIN_TEXT_CONTRAST: 5,

        MAX_FILESIZE: 64,

        STATES: {
            DEFAULT: 1,
            OK: 10,
            ERROR: 100,
            PENDING: 1000,
            WARN: 10000
        },

        STATE_NAMES: {
            1: "default",
            10: "ok",
            100: "error",
            1000: "pending",
            10000: "warn"
        },

        components: {
        },

        partials: partials,

        data: function () {

            return {
                uploadable: true,
                hasEditUI: true,
                type: "button"
            };
        },

        checkLength: function (length) {

            return length - (this.get("element.icon") && !this.get("element.hideIcon") ? this.MAX_LENGTH : this.MAX_LENGTH_NO_ICON);
        },

        onconfig: function () {

            this.CLASS.element = "P_PageElementButton";

            this.CLASS.text = "P_PageElementButton--text";
            this.CLASS.icon = "P_PageElementButton--icon";

            this.superOnconfig();

            if (Ractive.EDIT_MODE) {

                this.textCleaner = new TextCleaner(this);

                if (on.client) {

                    this.OPTIONS.DROPZONE = function () {

                        return {
                            url: "/upload-file",
                            paramName: "file",

                            uploadMultiple: false,
                            acceptedFiles: "",
                            maxFilesize: this.MAX_FILESIZE,

                            clickable: false,

                            dictInvalidFileType: "Nepodporovaný formát.",
                            dictFileTooBig: "Soubor je příliš velký ({{filesize}} MB). Velikost souboru může být maximálně {{maxFilesize}} MB.",
                            dictResponseError: "Soubor se nepodařilo nahrát (chyba: {{statusCode}})"
                        };
                    };

                    EventEmitter.on("saving:lang:start.Page." + this.EVENT_NS, function () {

                        this.skipTextObserver = true;

                    }.bind(this));

                    EventEmitter.on("saving:lang:end.Page." + this.EVENT_NS, function () {

                        this.skipTextObserver = false;

                    }.bind(this));

                }
            }
        },

        onrender: function () {

            this.superOnrender();

            this.$text = this.$self.find("." + this.CLASS.text);

            if (!this.Page.saving) {

                this.setDefaultValues();
            }

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

                        TextCleaner.placeCaretAtEnd(this.$text[0]);
                    }
                });

                if (!this.Page.saving) {

                    /*ie fix*/
                    this.ieFixBorderWidthTimeout = setTimeout(function() {

                        this.$self.find("." + this.CLASS.element).css({
                            borderWidth: ""
                        });

                    }.bind(this), 0);
                }
            }
        },

        oncomplete: function () {

            this.superOncomplete();
        },

        setDefaultValues: function () {

            if (!this.get("element.type")) {

                this.set("element.type", "button");
            }
        },

        initObservers: function () {

            if (this.observersInited) {

                return;
            }

            this.defPaletteObserver = this.Page.observe("page.settings.colorPalette.colors", function (current) {

                if (!current) {

                    return;
                }

                var colorRef = this.get("element.colorRef"),
                    color = this.get("element.color"),

                    userTextColorRef = this.get("element.userTextColorRef"),
                    userTextColor = this.get("element.userTextColor");

                if (typeof colorRef === "number" && color && current[colorRef] && current[colorRef] !== color) {

                    this.set("element.color", current[colorRef]);
                }

                if (typeof userTextColorRef === "number" && userTextColor && current[userTextColorRef] && current[userTextColorRef] !== userTextColor) {

                    this.set("element.userTextColor", current[userTextColorRef]);
                }

            }.bind(this), {init: false});

            this.linkObserver = this.observe("element.link", this.setIcon, {init: false});

            this.hideIconObserver = this.observe("element.hideIcon", function () {
                this.balanceText(400);
            }, {init: false});
//
            this.typeObserver = this.observe("element.type", function () {

                if (this.removing) {

                    return;
                }

                this.setIcon(this.get("element.link"));

            }, {init: false});

            this.addToCartObserver = this.observe("element.addToCart", function () {

                this.setIcon(this.get("element.link"));

            }, {init: false});

            this.fileObserver = this.observe("element.file element.download", function () {

                this.setIcon(this.get("element.link"));

            }, {init: false});

            this.iconObserver = this.observe("element.icon", function () {

                this.balanceText(400, this.get("lang"));

            }, {init: false});

            this.fillObserver = this.observe("element.fill", function (state) {

                this.PageSection.set("stopColorTransitions", false);

                var generator = this.Page.defaultColorsGenerator,

                    color = this.get("element.color") || this.get("color") || this.get("defaultColors.specialColor");

                if (generator && color) {

                    this.set("element.textColor", state ? generator.getBlackWhite(color, this.MIN_TEXT_CONTRAST, true) : null);
                }

            }, {init: false});

            this.colorObserver = this.observe("element.color", function (color) {

                var generator = this.Page.defaultColorsGenerator;

                if (this.get("element.fill") && generator) {

                    this.set("element.textColor", generator.getBlackWhite(color || this.get("color") || this.get("defaultColors.specialColor"), this.MIN_TEXT_CONTRAST, true));
                }
            }, {init: false});

            this.defColorObserver = this.observe("defaultColors.specialColor color", function (color) {

                if (this.get("element.color")) {

                    return;
                }

                var generator = this.Page.defaultColorsGenerator;

                color = color || this.get("color") || this.get("defaultColors.specialColor");

                if (this.get("element.fill") && generator && color) {

                    this.set("element.textColor", generator.getBlackWhite(color, this.MIN_TEXT_CONTRAST, true));
                }

            }, {init: false});

            this.textObserver = this.observe("element.text.*", this.textCleaner.observer, {init: false});

            this.observersInited = true;
        },

        cancelObservers: function () {

            this.observersInited = false;

            if (this.textObserver) {

                this.defPaletteObserver.cancel();
                this.linkObserver.cancel();
                this.fileObserver.cancel();
                this.typeObserver.cancel();
                this.addToCartObserver.cancel();
                this.fillObserver.cancel();
                this.iconObserver.cancel();
                this.colorObserver.cancel();
                this.defColorObserver.cancel();
                this.textObserver.cancel();
            }
        },

        onteardown: function () {

            this.skipTextObserver = true;

            this.cancelObservers();

            if (Ractive.EDIT_MODE) {

                if (on.client) {

                    EventEmitter.off("." + this.EVENT_NS);
                }
            }

            clearTimeout(this.ieFixBorderWidthTimeout);
            clearTimeout(this.fixTextTimeout);

            this.superOnteardown();
        },

        setIcon: function (linkValue) {

            if (this.removing) {

                return;
            }

            if (this.get("element.type") === "link") {

                //email
                if (linkValue && linkValue.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {

                    this.set("element.icon", "<svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-email'></use></svg>");

                //iOS aplikace
                } else if (linkValue && linkValue.match(/^\s*(?:https?:\/\/)?(?:www\.)?itunes\.apple\.com\/[a-zA-Z0-9\-]+\/app/i)) {

                    this.set("element.icon", "<svg style='margin-top: -1px;'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-apple'></use></svg>");

                //Android aplikace
                } else if (linkValue && linkValue.match(/^\s*(?:https?:\/\/)?(?:www\.)?play\.google\.com\/store\/apps/i)) {

                    this.set("element.icon", "<svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-android'></use></svg>");

                //Windows aplikace
                } else if (linkValue && linkValue.match(/^\s*(?:https?:\/\/)?(?:www\.)?(?:windowsphone|microsoft)\.com\/[a-zA-Z0-9\-]+\/store\/apps/i)) {

                    this.set("element.icon", "<svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-windows'></use></svg>");

                //Stahovatelný soubor
                } else if (linkValue && linkValue.match(/(\/[^\/.]+|\\[^\\.]+)\.(?=[a-zA-Z0-9]+$)(?=(?!html$|htm$|php$|py$|asp$))/i)) {

                    this.set("element.icon", "<svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-download'></use></svg>");

                } else {

                    this.set("element.icon", null);
                }

            //Stahovatelný soubor
            } else if (this.get("element.download") && this.get("element.file")) {

                this.set("element.icon", "<svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-download'></use></svg>");

            //produkt do košíku
            } else if (this.get("element.addToCart") && this.get("element.product")) {

                this.set("element.icon", "<svg><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-cart'></use></svg>");

            } else {

                this.set("element.icon", null);
            }
        },

        removeNbsp: function () {

            if (this.removing) {

                return;
            }

            var text = (this.get("element.text." + this.get("lang")) || "");

            if (text.match(/&nbsp;/)) {

                this.set("element.text." + this.get("lang"), text.replace(/&nbsp;/g, " "));
            }
        },

        removeIfEmpty: function () {

            if (this.removing) {

                return;
            }

            var empty = (this.get("element.text." + this.get("lang")) || "").replace(/(?:<[^>]*>)/g, "").match(/^(\s|\&nbsp\;)*$/);

            if (empty) {

                var defaultText = this.get("defaultText");

                clearTimeout(this.balanceTextTimeout);

                clearTimeout(this.fixTextTimeout);

                if (defaultText) {

                    this.set("element.text." + this.get("lang"), defaultText);

                    return this.balanceText();
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

                this.skipTextObserver = true;

                this.$text.balanceText();

                this.set("element.text." + (lang || this.get("lang")), this.$text.html());

                this.skipTextObserver = false;

            }.bind(this), timeout || 0);
        },

        handleUploadSuccess: function (file, res) {

            this.set("element.type", "button");

            this.set("element.file", res.path);
            this.set("element.download", true);

            this.fire("fileUploaded", res);
        },

        action: function (event, editMode) {

            if (!editMode || (event.original.srcEvent || event.original).ctrlKey) {

                var link    = this.get("element.link")    || "",
                    product = this.get("element.product") || "",

                    type = this.get("element.type"),

                    $a;

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

                        $a = $("<a/>")
                            .attr("href", link)
                            .attr("target", target)
                            .appendTo("body");

                        $a.get(0).click();

                        $a.remove();
                    }

                } else {

                    if (this.get("element.scrollToSection")) {

                        this.Page.scrollToSection.scrollToSectionById(this.get("element.section"));
                    }

                    if (this.get("element.addToCart")) {

                    }

                    if (this.get("element.download")) {

                        var file = this.get("element.file");

                        $a = $("<a/>")
                            .attr("href",file)
                            .attr("download", file.match(/[^\\\/]+$/i)[0].replace(/[0-9]+-/, ""))
                            .appendTo("body");

                        $a.get(0).click();

                        $a.remove();
                    }

                }

            }
        },

        removeColorRefs: function () {

            this.set("element.userTextColorRef", null);
            this.set("element.colorRef", null);
            this.set("element.color", "");
            this.set("element.userTextColor", "");
        }
    });

}));

