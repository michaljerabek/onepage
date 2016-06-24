/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            PageSection = require("./../../"),

            components = {
                HeaderEditUI: require("./../../PageSectionEditUI/Types/HeaderEditUI"),
                PageElementMenu: require("./../../../PageElement/Types/PageElementMenu"),
                PageElementMenuSettings: Ractive.EDIT_MODE ? require("./../../../PageElement/PageElementSettings/Types/PageElementMenuSettings") : null,
            },

            partials = {
                pageSectionContent: require("./index.tpl"),
                pageSectionSettings: require("./page-section-settings.tpl"),
                pageSectionEditUI: "<HeaderEditUI section='{{.section}}' />"
            };

        module.exports = factory(Ractive, PageSection, components, partials);

    } else {

        root.PageSectionHeader = factory(root.Ractive, root.PageSection);
    }

}(this, function (Ractive, PageSection, components, partials) {

    return PageSection.extend({

        partials: partials || {},

        components: components || {},

        data: function () {

            return {

            };
        },

        onconfig: function () {

            this.superOnconfig();

            this.setDefaultValues();

        },

        onrender: function () {

            this.superOnrender();

            var titles = this.findAllComponents("PageElementText");

            this.Title = titles[0];
            this.Subtitle = titles[1];

            this.set("titlesEmpty", this.Title.empty && this.Subtitle.empty);

            this.on("*.emptyText", function () {

                this.set("titlesEmpty", this.Title.empty && this.Subtitle.empty);
                this.set("titleNotSubtitle", !this.Title.empty && this.Subtitle.empty);

            }.bind(this));

            if (Ractive.EDIT_MODE) {

                this.on("*.elementState", function () {

                    var titleState = this.Title.get("state"),
                        subtitleState = this.Subtitle.get("state");

                    this.set("titleActive", titleState === "active" || subtitleState === "active");
                    this.set("subtitleActive", subtitleState === "active");

                }.bind(this));
            }

            if (Ractive.EDIT_MODE) {

                if (this.Title && this.Subtitle) {

                    this.titleObserver = this.Title.observe("state", function () {

                        this.Subtitle.handleBlur({});

                    }.bind(this), {init: false, defer: true});
                }
            }

        },

        oncomplete: function () {
            this.superOncomplete();
        },

        onteardown: function () {
            this.superOnteardown();


            if (this.titleObserver) {

                this.titleObserver.cancel();
            }
        },

        setDefaultValues: function () {

            var section = this.get("section");

            if (!section.layout) {

                this.set("section.layout", "center");
            }

            if (!section.menu) {

                this.set("section.menu", {});
            }
        },

        getTextPaths: function () {

            var paths = PageSection.prototype.getTextPaths.apply(this);

            paths = paths.concat(["title", "subtitle"]);

            var menuLinks = (this.get("section.menu.links") || []).length;

            if (menuLinks) {

                for (--menuLinks; menuLinks >= 0; menuLinks--) {

                    paths.push("menu.links." + menuLinks + ".text");
                }
            }

            return paths;
        },

        getColorPaths: function () {

//            var paths = this.superGetColorPaths();
            var paths = PageSection.prototype.getColorPaths.apply(this);

            paths.push("section.menu.backgroundColor");
            paths.push("section.menu.textColor");

            return paths;
        }

    });

}));
