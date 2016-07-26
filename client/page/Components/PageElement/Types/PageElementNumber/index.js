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
        numberElement: "P_PageElementNumber"
    };

    return PageElement.extend({

        components: {
        },

        partials: partials,

        data: function () {

            return {
                type: "number",
                hasEditUI: true,
                removeNbsp: true,
                source: "number"
            };
        },

        onconfig: function () {

            this.superOnconfig();

            if (Ractive.EDIT_MODE) {

                this.textCleaner = new TextCleaner(this, this.get("maxLength"));

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
            }
        },

        onrender: function () {

            this.superOnrender();

            this.$text = this.$self.find("." + CLASS.numberElement);

            Ractive.$win = Ractive.$win || $(window);

            this.fire("emptyText", this.empty, this);

            if (Ractive.EDIT_MODE) {

                this.observe("element." + (this.get("source") || "number") + ".*", this.textCleaner.numberObserver, {init: false});

                this.EventEmitter
                    .on("saved.Page." + this.EVENT_NS, this.handleModified.bind(this))
                    .on("langChanged.Page." + this.EVENT_NS, this.handleModified.bind(this));

                this.observe("state", function (state) {

                    this.fire("elementState", state, this);

                }, {init: false});
            }
        },

        handleBlur: function (event) {

            if (event.original && event.original.relatedTarget && event.original.relatedTarget.className.match(/medium-editor/)) {

                return;
            }

            if (this.empty && typeof this.get("defaultValue") !== "undefined") {

                this.set("element." + (this.get("source") || "number") + "." + this.get("lang"), "" + this.get("defaultValue"));
            }

            if (this.get("removeNbsp")) {

                var source = this.get("source") || "number",
                    lang = this.get("lang");

                if (U.isIE11()) {

                    this.cleanText(this.get("element." + source + "." + lang), this.get("element." + source + "." + lang));
                }

                var text = this.get("element." + source + "." + lang),

                    noNbsp = text.replace(/\&nbsp;/ig, " "),

                    noNbspAndSpans = noNbsp.replace(/(\s{0}<\/?(span[^>]*)>\s{0})/ig, "");

                clearTimeout(this.nbspTimeout);

                this.nbspTimeout = setTimeout(function() {

                    var promise = this.set("element." + source + "." + lang, noNbspAndSpans);

                    promise.then(this.handleModified.bind(this, true));

                }.bind(this), 0);

            } else {

                this.handleModified();
            }
        },

        handleModified: function () {
//
            if (this.torndown) {

                return;
            }

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
                .off("langChanged.Page." + this.EVENT_NS);
        },

        isEmpty: function () {

            var source = this.get("source") || "number",
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

