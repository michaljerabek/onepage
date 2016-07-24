/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            on = require("./../../../../../../helpers/on"),
            PageSection = require("./../../"),

            components = {
                BasicEditUI: require("./../../PageSectionEditUI/")
            },

            partials = {
                pageSectionContent: require("./index.tpl"),
                pageSectionSettings: require("./page-section-settings.tpl"),
                pageSectionEditUI: "<BasicEditUI section='{{.section}}' />"
            };

        module.exports = factory(Ractive, PageSection, components, partials, on);

    } else {

        root.PageSectionFeatureFull = factory(root.Ractive, root.PageSection);
    }

}(this, function (Ractive, PageSection, components, partials, on) {

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

            if (Ractive.EDIT_MODE) {

                this.observe("layout", function (state) {

                    if (state) {

                        this.set("section.layout", state.hor + "-" + state.ver);

                        this.set("reverseButtons", state.hor === "right" && window.innerWidth >= 1024);
                    }

                }, {init: false});

                if (on.client) {

                    if (window.innerWidth >= 1024 && this.get("layout.hor") === "right") {

                        this.set("reverseButtons", true);
                    }
                }

                this.observe("reverseButtons", function (state) {

                    if (state && window.innerWidth < 1024) {

                        this.set("reverseButtons", false);
                    }

                }, {init: false});
            }
        },

        onrender: function () {

            this.superOnrender();

            this.findElements();

            this.set("titlesEmpty", this.Title.empty && this.Content.empty);

            this.on("*.emptyText", function () {

                this.set("textsEmpty", this.Title.empty && this.Content.empty);
                this.set("titleNotContent", !this.Title.empty && this.Content.empty);
                this.set("notTitleContent", this.Title.empty && !this.Content.empty);

            }.bind(this));

            if (Ractive.EDIT_MODE) {

                this.on("*.elementState", function () {

                    var titleState = this.Title.get("state"),
                        contentState = this.Content.get("state");

                    this.set("textsActive", titleState === "active" || contentState === "active");
                    this.set("contentActive", contentState === "active");

                }.bind(this));
            }
        },

        oncomplete: function () {

            this.superOncomplete();
        },

        onteardown: function () {

            if (this.textCleaner) {

                this.textCleaner.destroy();
            }

            clearTimeout(this.contentObserverTimeout);

            this.superOnteardown();
        },

        setDefaultValues: function () {

            var section = this.get("section");

            if (Ractive.EDIT_MODE) {

                var hor = section.layout.match(/^[a-z]+/i),
                    ver = section.layout.match(/[a-z]+$/i);

                this.set("layout", {
                    hor: hor[0],
                    ver: ver[0]
                });
            }
        },

        findElements: function () {

            var texts = this.findAllComponents("PageElementText");

            this.Title = texts[0];
            this.Content = texts[1];
        },

        getTextPaths: function () {

            var paths = PageSection.prototype.getTextPaths.apply(this);

            paths = paths.concat(["title", "content"]);

            return paths;
        },

        findSectionImages: function () {
//
            var images = PageSection.prototype.findSectionImages.apply(this);//,
//
//                image = this.get("section.image");
//
//            if (image && image.src) {
//
//                images.unshift({
//                    src: image.src,
//                    name: image.alt || decodeURIComponent(image.src).split("/").pop().replace(/[0-9]+-/, "")
//                });
//            }
//
            return images;
        }

    });

}));
