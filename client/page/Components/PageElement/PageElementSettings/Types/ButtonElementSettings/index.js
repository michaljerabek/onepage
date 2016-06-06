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
                openTab: "color",
                settingsTitle: "Nastavení tlačítka"
            };
        },

        onrender: function () {

            this.superOnrender();
        },

        onconfig: function () {

            this.superOnconfig();

            this.Page = this.findParent("Page");

            this.set("image", this.PageSection.get("section.backgroundImage.src"));

            this.set("mostUsedColors", this.Page.findMostUsedColors());
            this.set("sectionsBgImages", this.Page.findSectionsBgImages());

            this.observe("data.scrollToSection", function (value) {

                if (value) {

                    this.set("data.download", false);
                }

            }, {init: false});

            this.observe("data.addToCart", function (value) {

                if (value) {

                    this.set("data.download", false);
                }

            }, {init: false});

            this.observe("data.download", function (value) {

                if (value) {

                    this.set("data.scrollToSection", false);
                    this.set("data.addToCart", false);
                }

            }, {init: false});
        },

        oncomplete: function () {
            this.superOncomplete();
        },

        onteardown: function () {
            this.superOnteardown();
        },

        getSections: function () {

            var lang = this.Page.get("page.lang"),

                sections = [];

            this.Page.forEachPageSection(function () {

                sections.unshift({
                    text:  this.get("section.name." + lang),
                    value: this.get("section.internalId")
                });

            });

            return sections;
        }
    });

}));

