/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var SuperPageSectionSettingsType = require("./../SuperPageSectionSettingsType");

        module.exports = factory(SuperPageSectionSettingsType);

    } else {

        root.BackgroundImageSettings = factory(root.SuperPageSectionSettingsType);
    }

}(this, function (SuperPageSectionSettingsType) {

    return SuperPageSectionSettingsType.extend({

        template: require("./index.tpl"),

        components: {
            FileBrowser: require("./../../../../../../libs/Components/FileBrowser")
        },

        partials: {
        },

        superOnrender: function () {

        },

        superOnconfig: function () {

        },

        superOncomplete: function () {

        }

    });

}));

