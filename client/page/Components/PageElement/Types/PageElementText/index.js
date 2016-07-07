/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageElement = require("./../../"),
            Ractive = require("ractive"),

            TextCleaner = require("./../../TextCleaner"),

            U = require("./../../../../../libs/U"),
            on = require("./../../../../../../helpers/on"),

            partials = {
                pageElementEditUI: require("./edit-ui.tpl"),
                pageElementContent: require("./index.tpl")
            };

        module.exports = factory(
            PageElement,
            Ractive,
            TextCleaner,
            U,
            partials,
            on
        );

    } else {

        root.PageElementTitle = factory(
            root.PageElement,
            root.Ractive,
            root.TextCleaner,
            root.U,
            {},
            {client: true}
        );
    }

}(this, function (PageElement, Ractive, TextCleaner, U, partials, on) {

    var CLASS = {
        textElement: "P_PageElementText"
    };

    return PageElement.extend({

        components: {
        },

        partials: partials,

        data: function () {

            return {
                type: "text",
                hasEditUI: true,
                balanceText: true,
                removeNbsp: true,
                editor: "content",
                source: "text"
            };
        },

        onconfig: function () {

            this.superOnconfig();

            if (Ractive.EDIT_MODE) {

                this.on("stateChange", function (state) {

                    if (state && (this.hasFocusedEditor() || this.focusin)) {

                        this.set("state", "active");

                    } else {

                        this.set("state", "inactive");
                    }
                });

                this.on("activate", function (event) {

                    event.original.preventDefault();

                    setTimeout(function() {

                        var editable = this.find("[data-medium-editor-element='true']");

                        if (editable) {

                            editable.focus();

                            this.fire("stateChange", this.get("showOutline"));
                        }

                    }.bind(this), 0);
                });

                this.observe("state", function (state) {

                    this.fire("elementState", state, this);

                }, {init: false});
            }
        },

        onrender: function () {

            this.superOnrender();

            this.$text = this.$self.find("." + CLASS.textElement);

            Ractive.$win = Ractive.$win || $(window);

            if (this.get("countLines")) {

                this.observe("element." + (this.get("source") || "title") + ".* lang", function (value, prevValue, path) {

                    if (path === "lang" && this.Page.saving) {

                        return;
                    }

                    this.countLines();

                }, {init: false, defer: true});

                Ractive.$win.on("resize.lines-" + this.EVENT_NS, this.countLines.bind(this));

                this.lineCounter();

                if (document.fonts) {

                    document.fonts.ready.then(function () {

                        this.lineCounter();

                    }.bind(this));
                }
            }

            if (this.get("balanceText")) {

                this.$text.balanceText();

                if (document.fonts) {

                    document.fonts.ready.then(function () {

                        this.$text.balanceText();

                    }.bind(this));
                }
            }

            this.observe("element." + (this.get("source") || "title") + ".*", this.cleanText, {init: false});

            this.EventEmitter
                .on("saved.Page." + this.EVENT_NS, this.handleModified.bind(this))
                .on("langChanged.Page." + this.EVENT_NS, this.handleModified.bind(this))
                .on("fontChanged.Page." + this.EVENT_NS, function () {

                    clearTimeout(this.fontChangedTimeout);

                    this.fontChangedTimeout = setTimeout(this.handleModified.bind(this), 500);

                }.bind(this));

            this.on("layoutChanged", function () {

                clearTimeout(this.layoutChangedTimeout);

                this.layoutChangedTimeout = setTimeout(this.handleModified.bind(this, {}), 500);

            });

            this.fire("emptyText", this.empty, this);
        },

        countLines: function () {

            if (!this.get("countLines")) {

                return;
            }

            clearTimeout(this.lineCounterTimeout);

            this.lineCounterTimeout = setTimeout(this.lineCounter.bind(this), 150);
        },

        lineCounter: function(scale) {

            scale = scale || 1;

            this.set("scale", scale).then(function () {

                var lineHeight = Math.round(parseFloat(this.$text.css("line-height"))),

                    height = this.$text.height(),

                    res = Math.round(height / lineHeight) || 0;

                this.set("lines", res);
                this.set("specialClass1", "lines-" + res);

                if (res >= scale) {

                    this.set("scale", res).then(function () {

                        if (res > scale) {

                            this.lineCounter(scale + 1);
                        }

                    }.bind(this));

                }

            }.bind(this));
        },

        cleanText: function (value, prevValue) {

            if (this.Page.saving || this.skipTextObserver) {

                return;
            }

            var text = this.$text.text() || "",

                maxLength = this.get("maxLength");

            if (!maxLength) {

                return;
            }

            text = text.replace(/\&nbsp;/ig, " ");

            //nahradit <br> mezerou
            text = text.replace(/(\s{0}<(br[^>]+)>\s{0})/ig, " ");

            //odstranit všechny tagy
            text = text.replace(/(<([^>]+)>)/ig, "");

            if (text.length > maxLength) {

                if (U.isIE11()) {

                    prevValue = text.substr(0, maxLength);
                }

                this.skipTextObserver = true;

                clearTimeout(this.fixTextTimeout);

                this.fixTextTimeout = setTimeout(function () {

                    this.skipTextObserver = true;

                    this.set("element." + (this.get("source") || "title") + "." + this.get("lang"), prevValue);

                    TextCleaner.placeCaretAtEnd(this.$text[0]);

                    this.skipTextObserver = false;

                }.bind(this), 0);
            }

        },

        handleBlur: function (event) {

            if (event.original && event.original.relatedTarget && event.original.relatedTarget.className.match(/medium-editor/)) {

                return;
            }

            if (this.get("removeNbsp")) {

                var source = this.get("source") || "title",
                    lang = this.get("lang");

                if (U.isIE11()) {

                    this.cleanText(this.get("element." + source + "." + lang), this.get("element." + source + "." + lang));
                }

                var text = this.get("element." + source + "." + lang),

                    noNbsp = text.replace(/\&nbsp;/ig, " ");

                clearTimeout(this.nbspTimeout);

                this.nbspTimeout = setTimeout(function() {

                    var promise = this.set("element." + source + "." + lang, noNbsp);

                    promise.then(this.handleModified.bind(this, true));

                }.bind(this), 0);

            } else {

                this.handleModified();
            }
        },

        handleModified: function () {

            if (this.get("balanceText")) {

                this.$text.balanceText();
            }

            this.countLines();

            this.fire("emptyText", this.empty, this);
        },

        oncomplete: function () {

            this.superOncomplete();
        },

        onteardown: function () {

            clearTimeout(this.fontChangedTimeout);
            clearTimeout(this.nbspTimeout);
            clearTimeout(this.fixTextTimeout);
            clearTimeout(this.isEmptyTimeout);
            clearTimeout(this.lineCounterTimeout);
            clearTimeout(this.layoutChangedTimeout);

            this.superOnteardown();

            this.EventEmitter
                .off("saved.Page." + this.EVENT_NS)
                .off("langChanged.Page." + this.EVENT_NS)
                .off("fontChanged.Page." + this.EVENT_NS);
        },

        isEmpty: function () {

            var source = this.get("source") || "title",
                lang = this.get("lang"),

                value = (this.get("element." + source + "." + lang) || ""),

                empty = !!value.replace(/(?:<[^>]*>)/g, "").match(/^(\s|\&nbsp\;)*$/);

            //pokud je element prázdný, ale obsahuje např. mezeru nebo <br> -> nahradit ""
            if (value && empty) {

                clearTimeout(this.isEmptyTimeout);

                this.isEmptyTimeout = setTimeout(function() {

                    this.set("element." + source + "." + lang, "");

                }.bind(this), 0);
            }

            this.empty = empty;

            this.addEmptyStateToParent(empty);

            return empty;
        }

    });

}));

