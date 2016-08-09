/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageElementSettings = require("./../../../PageElementSettings"),

            template = require("./index.tpl");

        module.exports = factory(PageElementSettings, template);

    } else {

        root.ColorSettings = factory(root.PageElementSettings, "");
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
                openTab: "backgroundColor",
                settingsTitle: "Nastavení menu"
            };
        },

        onrender: function () {

            this.superOnrender();
        },

        onconfig: function () {

            this.superOnconfig();

            this.set("mostUsedColors", this.Page.findMostUsedColors());
            this.set("sectionsBgImages", this.Page.findSectionsBgImages());

            if (this.parent.PageSection.findSectionImages) {

                this.set("sectionImages", this.parent.PageSection.findSectionImages());
            }

            this.addToMenuObserver = this.observe("sections.*.addToMenu", function () {

                this.parent.updateLinks();

            }, {init: false});
        },

        oncomplete: function () {

            this.superOncomplete();
        },

        onteardown: function () {

            this.addToMenuObserver.cancel();

            this.torndown = true;

            this.superOnteardown();
        },

        calcLinks: function (count, link) {

            if (link.addToMenu) {

                return count + 1;
            }

            return count;
        }
    });

}));

