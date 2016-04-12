/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var on = require("./../../../../../../helpers/on");
        var EventEmitter = require("./../../../../../libs/EventEmitter")();

        var Ractive = require("ractive"),

            template = require("./index.tpl");

        module.exports = factory(Ractive, template);

    } else {

        root.BackgroundImage = factory(root.Ractive, null);
    }

}(this, function (Ractive, template) {

    return Ractive.extend({

        template: template || "",

        CLASS: {
            self: "P_BackgroundImage"
        },

        components: {
        },

        partials: {
        },

        data: function () {

            return {
                editMode: Ractive.EDIT_MODE,
                data: {
                    backgroundImage: "",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",

                    parallax: false
                }
            };
        }

    });

}));
