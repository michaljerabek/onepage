/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            U = require("./../../../libs/U"),
            on = require("./../../../../helpers/on");

        module.exports = factory(
            Ractive,
            U,
            require("./index.tpl"),
            on
        );

    } else {

        root.PageSectionSettings = factory(
            root.Ractive,
            root.U,
            "",
            {client: true}
        );
    }

}(this, function (Ractive, U, template, on) {

    var instanceCounter = 0;

    return Ractive.extend({

        template: template,

        CLASS: {
            self: "P_PageElement"
        },

        components: {
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

