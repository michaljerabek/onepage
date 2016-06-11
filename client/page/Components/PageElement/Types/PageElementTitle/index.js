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
            };

        module.exports = factory(
            PageElement,
            Ractive,
            U,
            partials,
            on
        );

    } else {

        root.PageElementTitle = factory(
            root.PageElement,
            root.Ractive,
            root.U,
            {},
            {client: true}
        );
    }

}(this, function (PageElement, Ractive, U, partials, on) {

    return PageElement.extend({

        components: {
        },

        partials: partials,

        data: function () {

            return {
                type: "title",
                hasEditUI: true
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
            }
        },

        onrender: function () {

            this.superOnrender();

            this.$text = this.$self.find(".P_PageElementTitle");

            this.$text.balanceText();

            Ractive.$win = Ractive.$win || $(window);

            if (this.get("countLines")) {

                this.observe("element." + (this.get("source") || "title") + ".* lang", function (value, prevValue, path) {

                    //TODO: po uložení spustit znovu
                    if (path === "lang" && this.Page.saving) {

                        return;
                    }

                    this.countLines();

                }, {init: false, defer: true});

                Ractive.$win.on("resize.lines-" + this.EVENT_NS, this.countLines.bind(this));

                this.lineCounter();
            }

            this.observe("element." + (this.get("source") || "title") + ".*", function (value, prevValue, path) {

                //TODO: po uložení spustit znovu
                if (this.Page.saving || this.skipTextObserver) {

                    return;
                }

                var text = this.$text.text() || "",

                    maxLength = this.get("maxLength");

                //nahradit <br> mezerou
                text = text.replace(/(\s{0}<(br[^>]+)>\s{0})/ig, " ");

                //odstranit všechny tagy
                text = text.replace(/(<([^>]+)>)/ig, "");

                if (text.length > (maxLength || 100)) {

                    this.skipTextObserver = true;

                    clearTimeout(this.fixTextTimeout);

                    this.fixTextTimeout = setTimeout(function () {

                        this.skipTextObserver = true;

                        this.set("element." + (this.get("source") || "title") + "." + this.get("lang"), prevValue);

                        this.placeCaretAtEnd(this.$text[0]);

                        this.skipTextObserver = false;

                    }.bind(this), 0);
                }

            }, {init: false});

            this.EventEmitter.on("saved.Page." + this.EVENT_NS, this.handleBlur.bind(this));
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

//                res = isNaN(res) ? 0 : 1;

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

        handleBlur: function (event) {

            if (event.original && event.original.relatedTarget && event.original.relatedTarget.className.match(/medium-editor/)) {

                return;
            }

            this.$text.balanceText();

            this.countLines();
        },

        oncomplete: function () {

            this.superOncomplete();
        },

        onteardown: function () {

            clearTimeout(this.fixTextTimeout);
            clearTimeout(this.isEmptyTimeout);
            clearTimeout(this.lineCounterTimeout);

            this.superOnteardown();

            this.EventEmitter.off("saved.Page." + this.EVENT_NS);
        },

        isEmpty: function () {

            var value = (this.get("element." + (this.get("source") || "title") + "." + this.get("lang")) || ""),

                empty = value.replace(/(?:<[^>]*>)/g, "").match(/^(\s|\&nbsp\;)*$/);

            if (value && empty) {

                clearTimeout(this.isEmptyTimeout);

                this.isEmptyTimeout = setTimeout(function() {

                    this.set("element." + (this.get("source") || "title") + "." + this.get("lang"), "");

                }.bind(this), 0);
            }

            this.addEmptyStateToParent(empty);

            return empty;
        }

    });

}));

