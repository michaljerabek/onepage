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

        root.ButtonElement = factory(
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
                type: "button",
                hasEditUI: true,
                settingsTitle: "Nastavení tlačítka"
            };
        },

        onconfig: function () {

            this.CLASS.text = "P_ButtonElement--text";

            this.superOnconfig();

            if (Ractive.EDIT_MODE) {

                this.observe("element.text.*", function (currentValue, prevValue, path) {

                    if (this.skipTextObserver) {

                        return;
                    }

                    var inputValue = currentValue;

                    if (currentValue && currentValue.match(/(<([^>]+)>)/ig)) {

                        currentValue = currentValue.replace(/(<([^>]+)>)/ig, "");
                    }

                    if (currentValue && currentValue.length > 30) {

                        currentValue = prevValue;
                    }

                    if (currentValue !== inputValue) {

                        this.skipTextObserver = true;

                        clearTimeout(this.fixTextTimeout);

                        this.fixTextTimeout = setTimeout(function () {

                            this.set(path, currentValue);

                            this.placeCaretAtEnd(this.textElement);

                            this.skipTextObserver = false;

                        }.bind(this), 0);
                    }

                }, {init: false});

//                this.on("stateChange", function (state) {
//
//                    if (state && (this.hasFocusedEditor() || this.focusin)) {
//
//                        this.set("state", "active");
//
//                    } else {
//
//                        this.set("state", "inactive");
//                    }
//                });
//
//                this.on("activate", function (event) {
//
//                    event.original.preventDefault();
//
//                    setTimeout(function() {
//
//                        var editable = this.find("[data-medium-editor-element='true']");
//
//                        if (editable) {
//
//                            editable.focus();
//
//                            this.fire("stateChange", this.get("showOutline"));
//                        }
//
//                    }.bind(this), 0);
//                });
            }
        },

        onrender: function () {

            this.superOnrender();

            if (Ractive.EDIT_MODE) {

                this.Page = this.findParent("Page");

                this.textElement = this.find("." + this.CLASS.text);

//                this.set("mostUsedColors", this.Page.findMostUsedColors());

                this.observe("element.link", function (value) {

                    if (value) {

                        if (value.match(/^(?:https?:\/\/)?(?:www\.)?itunes\.apple\.com\/[a-zA-Z0-9\-]+\/app/i)) {

                            this.set("element.icon", "<svg><use xlink:href='#icon-apple'></use></svg>");

                        } else if (value.match(/^(?:https?:\/\/)?(?:www\.)?play\.google\.com\/store\/apps/i)) {

                            this.set("element.icon", "<svg><use xlink:href='#icon-android'></use></svg>");

                        } else if (value.match(/^(?:https?:\/\/)?(?:www\.)?(?:windowsphone|microsoft)\.com\/[a-zA-Z0-9\-]+\/store\/apps/i)) {

                            this.set("element.icon", "<svg><use xlink:href='#icon-windows'></use></svg>");

                        } else if (value.match(/\.(?=[a-zA-Z0-9]+$)(?=(?!html$|htm$|php$|py$|asp$))/i)) {

                            this.set("element.icon", "<svg><use xlink:href='#icon-download'></use></svg>");

                        } else {

                            this.set("element.icon", null);
                        }
                    }
                });

            }
        },

        oncomplete: function () {

            this.superOncomplete();
        },

        onteardown: function () {

            this.superOnteardown();

            clearTimeout(this.fixTextTimeout);
        },

//        isEmpty: function () {
//
//            return (this.get("element.text." + this.get("lang")) || "").replace(/(?:<[^>]*>)/g, "").match(/^(\s|\&nbsp\;)*$/);
//        },
//
        removeIfEmpty: function () {

            var empty = (this.get("element.text." + this.get("lang")) || "").replace(/(?:<[^>]*>)/g, "").match(/^(\s|\&nbsp\;)*$/);

            if (empty) {

                this.getPageSection().set("section.button", null);
            }
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

            if (editMode) {

                event.original.preventDefault();
            }
        }
    });

}));

