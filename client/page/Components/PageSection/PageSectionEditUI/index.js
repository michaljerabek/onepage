/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            template = require("./index.tpl");

        module.exports = factory(Ractive, template);

    } else {

        root.PageSectionEditUI = factory(root.Ractive, "");
    }

}(this, function (Ractive, template) {

    return Ractive.extend({

        template: template,

        components: {
            BasicEditUI: require("./Types/BasicEditUI")
        },

        partials: {
            PageSectionAEditUI: "<BasicEditUI section='{{.section}}' />",
            PageSectionBEditUI: "<BasicEditUI section='{{.section}}' />",
            PageSectionCEditUI: "<BasicEditUI section='{{.section}}' />"
        },

        onrender: function () {

        },

        onconfig: function () {

            this.on("*.removeSection", function (event) {
                this.fire("removeSection", event);
            });

            this.on("*.openPageSectionSettings", function (event, settingsType) {

                this.fire("openPageSectionSettings", settingsType);
            });
        },

        oncomplete: function () {

        }

    });

}));

