/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var SuperPageSectionSettingsType = require("./../SuperPageSectionSettingsType"),

            template = require("./index.tpl");

        module.exports = factory(SuperPageSectionSettingsType, template);

    } else {

        root.ColorSettings = factory(root.SuperPageSectionSettingsType, root.ColorPicker, root.ColorPickerPalette, "");
    }

}(this, function (SuperPageSectionSettingsType, template) {

    return SuperPageSectionSettingsType.extend({

        template: template,

        components: {
        },

        partials: {

        },

        data: function () {

            return {
                openTab: 1,

                imageColors: {}
            };
        },

        onrender: function () {
            this.superOnrender();
        },

        onconfig: function () {
            this.superOnconfig();
        },

        oncomplete: function () {
            this.superOncomplete();
        },

        onteardown: function () {
            this.superOnteardown();
        }
    });

}));

