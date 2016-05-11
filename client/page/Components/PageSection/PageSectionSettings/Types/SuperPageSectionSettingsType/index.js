/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive");

        module.exports = factory(Ractive);

    } else {

        root.SuperPageSectionSettingsType = factory(root.Ractive);
    }

}(this, function (Ractive) {

    return Ractive.extend({

        components: {
        },

        partials: {
            Text: require("./../../../../../../libs/Components/UI/Text/index.tpl")
        },

        superOnrender: function () {

        },

        superOnconfig: function () {

        },

        superOncomplete: function () {

        },

        superOnteardown: function () {

        }

    });

}));

