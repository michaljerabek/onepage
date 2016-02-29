/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
var Ractive = require("ractive");

var CLASS = require("./../../../CLASSNAMES");

module.exports = Ractive.extend({

    template: require("./index.tpl"),

    components: {
        PageSectionA: require("./../PageSectionA"),
        PageSectionB: require("./../PageSectionB"),
        PageSectionC: require("./../PageSectionC"),

        PageSectionSettings: require("./../PageSectionSettings")
    },

    partials: {
        PageSectionA: "<PageSectionA section='{{section}}' />",
        PageSectionB: "<PageSectionB section='{{section}}' />",
        PageSectionC: "<PageSectionC section='{{section}}' />"
    },

    onconfig: function () {

        //Když se otevírá nastavení sekce, je potřeba zavřít již otevřené nastavení
        this.observe("openPageSectionSettings", this.closeOtherOpenedSettings);

        //Zjišťuje, jestli je jiné nastavení této sekce otevřené.
        //Pokud se otevírá nastavení sekce a jiné nastavení té samé sekce je už otevřené, nastavení se otevře až po zavření již otevřeného.
        this.observe("openPageSectionSettings", function (now, before) {

            this.set("anotherSettingsOpened", !!before);
        });

        //Uživatel kliknul na "zavřít" v nastavení.
        this.on("PageSectionSettings.closeThisSettings", function () {

            this.set("openPageSectionSettings", false);
        });
    },

    onrender: function () {
    },

    //Když se otevírá nastavení sekce, je potřeba zavřít již otevřené nastavení
    //(observer) openThis -> má se nastevení této sekce otevřít?
    closeOtherOpenedSettings: function (openThis) {

        if (!openThis) {

            return;
        }

        var siblingSections = this.findSiblingComponents("PageSection"),
            s = siblingSections.length - 1;

        for (s; s > -1; s--) {

            siblingSections[s].set("openPageSectionSettings", false);
        }
    },

    //Vrátí současnou pozici sekce na stránce.
    getCurrentIndex: function () {
        return $(this.findSectionElement()).index();
    },

    findSectionElement: function () {

        return this.find("." + CLASS.PageSections.section);
    }

});
