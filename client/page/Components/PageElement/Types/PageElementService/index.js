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

        root.PageElementService = factory(
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
        factElement: "P_PageElementService"
    };

    return PageElement.extend({

        hasEditor: false,

        getNewItem: function (lang) {

            lang = lang || this.get("lang");

            var item = {
                title: {},
                content: {}
            };

            item.icon = "";

            item.setColor = "fill";

            item.title[lang] = "Služba";
            item.content[lang] = "Popis nabízené služby.";

            return item;
        },

        components: {
        },

        partials: partials,

        data: function () {

            return {
                uploadable: false,
                hasEditUI: true,
                type: "service",
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

