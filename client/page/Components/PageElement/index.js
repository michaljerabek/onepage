/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            PageElementSettings = require("./PageElementSettings"),

            U = require("./../../../libs/U"),
            on = require("./../../../../helpers/on");

        module.exports = factory(
            Ractive,
            PageElementSettings,
            U,
            require("./index.tpl"),
            on
        );

    } else {

        root.PageElement = factory(
            root.Ractive,
            root.PageElementSettings,
            root.U,
            "",
            {client: true}
        );
    }

}(this, function (Ractive, PageElementSettings, U, template, on) {

    var instanceCounter = 0;

    return Ractive.extend({

        template: template,

        CLASS: {
            self: "P_PageElement"
        },

        components: {
            PageElementSettings: PageElementSettings
        },

        partials: {
            pageElementEditUI: "",
            pageElementContent: ""
        },

        data: function () {

            return {

            };
        },

        superOnconfig: function () {

            this.EVENT_NS = "PageElement-" + (++instanceCounter);

            if (on.client) {

                Ractive.$win = Ractive.$win || $(window);
            }
        },

        superOnrender: function () {

            if (on.client) {

                this.self = this.find("." + this.CLASS.self);
                this.$self = $(this.self);
            }
        },

        superOncomplete: function () {

        },

        superOnteardown: function () {

        }

    });

}));

