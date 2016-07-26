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

        root.PageElementFact = factory(
            root.PageElement,
            root.EventEmitter,
            root.Ractive,
            root.U,
            {},
            {client: true}
        );
    }

}(this, function (PageElement, EventEmitter, Ractive, U, partials, on) {

    var CLASS = {
        factElement: "P_PageElementFact"
    };

    return PageElement.extend({

        hasEditor: false,

        getNewItem: function (lang, type) {

            lang = lang || this.get("lang");

            var item = {
                text: {}
            };

            if (type === "icon") {

                item.icon = "";

                item.setColor = "fill";

            } else {

                item.number = {};

                item.number[lang] = "1";
            }

            item.text[lang] = "Fakt";

            return item;
        },

        components: {
        },

        partials: partials,

        data: function () {

            return {
                uploadable: false,
                hasEditUI: true,
                activateButton: true,
                activateIcon: "#icon-add-image",
                type: "fact",
                pulseOutline: false
            };
        },

        onconfig: function () {

            this.superOnconfig();

            if (Ractive.EDIT_MODE) {

            }
        },

        onrender: function () {

            this.superOnrender();

            this.setDefaultValues();

            if (Ractive.EDIT_MODE) {

//                this.on("activate", function (event) {
//
//                    if (event.original.srcEvent.type.match(/touch/)) {
//
//                        this.handleTouchstart({
//                            original: event.original.srcEvent
//                        });
//
//                        this.handleTouchend({
//                            original: event.original.srcEvent
//                        });
//                    }
//
//                    this.find("." + CLASS.imageElement).focus();
//
//                    this.set("state", "active");
//
//                    this.fire("elementState", "active");
//                });
//
//                this.on("stateChange", function (state) {
//
//                    if (state && this.focusin) {
//
//                        this.set("state", "active");
//
//                        this.fire("elementState", "active");
//
//                    } else if (!state && !this.focusin) {
//
//                        this.set("state", "inactive");
//
//                        this.fire("elementState", "inactive");
//                    }
//                });

            }
        },

        oncomplete: function () {

            this.superOncomplete();
        },

        setDefaultValues: function () {

        },

        initObservers: function () {

        },

        cancelObservers: function () {

        },

        onteardown: function () {

            this.cancelObservers();

            this.superOnteardown();
        }
    });

}));

