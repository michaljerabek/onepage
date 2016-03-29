/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var Ractive = require("ractive"),
    on = require("./../../../../../../helpers/on"),
    EventEmitter = require("./../../../../../libs/EventEmitter")();

module.exports = Ractive.extend({

    TYPE: "PageSectionType",

    components: {
        PageElementSettings: require("./../../PageElementSettings")
    },

    partials: {
    },

    superOnconfig: function () {

        if (on.client) {

            //otevírá se nastavení elementu na stránce -> zavřít nastavení v ostatních sekcích
            EventEmitter.on("openPageElementSettings.PageSection sortPageSection.PageSectionManager", function (e, pageSectionType) {

                if (pageSectionType !== this) {

                    this.togglePageElementSettings(false);
                }
            }.bind(this));
        }

        //uživatel otevírá nastavení elementu v sekci
        this.on("openPageElementSettings", function (event, type) {

            this.set("pageElementSettingsPositionElement", event.node);

            type = type === this.get("openPageElementSettings") ? false : type;

            this.togglePageElementSettings(type);

            EventEmitter.trigger("openPageElementSettings.PageSection", this);
        });

        //Uživatel kliknul na "zavřít" v nastavení.
        this.on("PageElementSettings.closeThisSettings", this.togglePageElementSettings.bind(this, false));
    },

    superOnrender: function () {

    },

    togglePageElementSettings: function (state) {

        this.set("openPageElementSettings", state);

        this.fire("sectionHasSettings", state);
    }

});
