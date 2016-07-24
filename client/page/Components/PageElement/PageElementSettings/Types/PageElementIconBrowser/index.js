/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $, FormData*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageElementSettings = require("./../../../PageElementSettings"),

            template = require("./index.tpl");

        module.exports = factory(PageElementSettings, template);

    } else {

        root.PageElementIconBrowser = factory(root.PageElementSettings, "");
    }

}(this, function (PageElementSettings, template) {

    return PageElementSettings.extend({

        components: {
        },

        partials: {
            pageElementSettingsContent: template
        },

        data: function () {

            return {
                settingsTitle: "Vybrat ikonu",
                type: "icon-browser"
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

            this.torndown = true;

            this.superOnteardown();
        }
    });

}));

