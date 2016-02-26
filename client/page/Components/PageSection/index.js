/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var Ractive = require("ractive");

module.exports = Ractive.extend({

    template: require("./index.tpl"),

    components: {
        PageSectionA: require("./../PageSectionA"),
        PageSectionB: require("./../PageSectionB"),
        PageSectionC: require("./../PageSectionC")
    },

    partials: {
        PageSectionA: "<PageSectionA section='{{section}}' />",
        PageSectionB: "<PageSectionB section='{{section}}' />",
        PageSectionC: "<PageSectionC section='{{section}}' />"
    },

    onrender: function () {

        this.observe("openPageSectionSettings", this.hideOpenedSettingsIfAnotherIsOpened);

    },

    onconfig: function () {

    },

    hideOpenedSettingsIfAnotherIsOpened: function (openThis) {

        if (!openThis) {

            return;
        }

        var allSections = this.parent.findAllComponents("PageSection"),
            s = allSections.length - 1;

        for (s; s > -1; s--) {

            if (allSections[s] !== this) {

                allSections[s].set("openPageSectionSettings", false);
            }
        }
    }



});
