/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            PageSection = require("./../../"),

            components = {
                BasicEditUI: require("./../../PageSectionEditUI")
            },

            partials = {
                pageSectionContent: require("./index.tpl"),
                pageSectionSettings: require("./page-section-settings.tpl"),
                pageSectionEditUI: "<BasicEditUI section='{{.section}}' />"
            };

        module.exports = factory(Ractive, PageSection, components, partials);

    } else {

        root.PageSectionClaim = factory(root.Ractive, root.PageSection);
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

        oninit: function () {

            this.superOninit();

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

                this.observe("section.layout", function (layout) {

                    this.set("section.fullSize", layout === "full-size");

                });

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


        },

        getTextPaths: function () {

            var paths = PageSection.prototype.getTextPaths.apply(this);

            paths = paths.concat(["title", "subtitle"]);

            return paths;
        },

        getColorPaths: function () {

            var paths = PageSection.prototype.getColorPaths.apply(this);

            return paths;
        }

    });

}));
