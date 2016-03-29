/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageElement = require("./../../"),

            U = require("./../../../../../libs/U"),
            on = require("./../../../../../../helpers/on"),

            partials = {
                pageElementEditUI: require("./edit-ui.tpl"),
                pageElementContent: require("./index.tpl")
            };

        module.exports = factory(
            PageElement,
            U,
            partials,
            on
        );

    } else {

        root.PageElementTitle = factory(
            root.PageElement,
            root.U,
            {},
            {client: true}
        );
    }

}(this, function (PageElement, U, partials, on) {

    return PageElement.extend({

        CLASS: {
            self: "P_PageElement"
        },

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
        },

        onrender: function () {

            this.superOnrender();
        },

        oncomplete: function () {

            this.superOncomplete();
        },

        onteardown: function () {

            this.superOnteardown();
        }

    });

}));

