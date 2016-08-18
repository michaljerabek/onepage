/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageSectionSettings = require("./../../../PageSectionSettings"),

            EventEmitter = require("./../../../../../../libs/EventEmitter")(),

            template = require("./index.tpl");

        module.exports = factory(PageSectionSettings, EventEmitter, template);

    } else {

        root.ColorSettings = factory(root.PageSectionSettings, root.EventEmitter, "");
    }

}(this, function (PageSectionSettings, EventEmitter, template) {

    return PageSectionSettings.extend({

//        template: template,

        components: {
        },

        partials: {
            pageSectionSettingsContent: template,
            layoutHeader: require("./partials/layout-header.tpl"),
            layoutFeature: require("./partials/layout-feature.tpl"),
            layoutFeatureFull: require("./partials/layout-feature-full.tpl"),
            layoutClaim: require("./partials/layout-claim.tpl"),
            layoutServices: require("./partials/layout-services.tpl")
        },

        data: function () {

            return {
            };
        },

        onrender: function () {
            this.superOnrender();
        },

        onconfig: function () {

            this.superOnconfig();

            this.winWidthObserver = this.root.observe("windowWidth", function (width) {

                this.set("windowWidth", width);

            }.bind(this));

            this.observe("data.addToMenu", function (state) {

                EventEmitter.trigger("addToMenuChanged.PageSection", [state, this]);

            }, {init: false});

        },

        oncomplete: function () {
            this.superOncomplete();
        },

        onteardown: function () {
            this.superOnteardown();

            this.winWidthObserver.cancel();
        }
    });

}));

