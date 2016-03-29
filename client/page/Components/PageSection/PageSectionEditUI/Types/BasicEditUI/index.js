/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            template = require("./index.tpl"),

            partials = {
                EditUIControlsTopLeft: require("./partials/top-left.tpl"),
                EditUIControlsTopRight: require("./partials/top-right.tpl"),
                EditUIControlsBottomLeft: require("./partials/bottom-left.tpl"),
                EditUIControlsBottomRight: require("./partials/bottom-right.tpl")
            };

        module.exports = factory(Ractive, template, partials);

    } else {

        root.BasicEditUI = factory(root.Ractive, "");
    }

}(this, function (Ractive, template, partials) {

    /*
     * Základní typ ovládacích prvků sekce. Každý další typ by měl rozšiřovat tento typ.
     * Komponent obsahuje "partials" s ovládacími prvky pro každý roh. Podtypy mohou tyto partialy
     * přepsat nebo je možné je vypnout přidáním dat:
     * { EditUIControlsTopLeft: false }
     * Nebo je možné vypnout jen některá tlačítka:
     * { removeSectionButton: false }
     */

    var BasicEditUI = {

        components: {
        },

        partials: partials || {},

        onrender: function () {

        },

        onconfig: function () {

        },

        oncomplete: function () {

        }

    };

    if (template) {

        BasicEditUI.template = template;
    }

    return Ractive.extend(BasicEditUI);

}));

