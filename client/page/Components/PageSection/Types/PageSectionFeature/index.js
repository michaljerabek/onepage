/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            PageSection = require("./../../"),

            components = {
                BasicEditUI: require("./../../PageSectionEditUI/")
            },

            partials = {
                pageSectionContent: require("./index.tpl"),
                pageSectionSettings: require("./page-section-settings.tpl"),
                pageSectionEditUI: "<BasicEditUI section='{{.section}}' />"
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

            if (Ractive.EDIT_MODE) {

                this.observe("layout", function (state) {

                    if (state) {

                        this.Title.set("stopTransition", true);
                        this.Content.set("stopTransition", true);
                        this.Image.set("stopTransition", true);

                        if (state.main === "top" || state.main === "bottom") {

                            this.set("section.layout", state.main)
                                .then(this.updateElements.bind(this));

                            return;
                        }

                        this.set("section.layout", state.main + "-" + state.text)
                            .then(this.updateElements.bind(this));
                    }

                }, {init: false});
            }
        },

        onrender: function () {

            this.superOnrender();

            this.updateElements(false);

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
                    this.set("imageActive", this.Image.get("state") === "active");

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

                var main = section.layout.match(/^[a-z]+/i),
                    text = section.layout.match(/[a-z]+$/i);

                this.set("layout.main", main[0]);
                this.set("layout.text", text ? text[0] : "");
            }
        },

        updateElements: function (updateData) {

            var lang = this.get("lang"),

                texts = this.findAllComponents("PageElementText");

            this.Title = texts[0];
            this.Content = texts[1];
            this.Image = this.findComponent("PageElementImage");

            if (updateData !== false) {

                this.update("section.title." + lang);
                this.update("section.content." + lang);
            }
        },

        getTextPaths: function () {

            var paths = PageSection.prototype.getTextPaths.apply(this);

            paths = paths.concat(["title", "content"]);

            return paths;
        },
        
        findSectionImages: function () {
            
            var images = PageSection.prototype.findSectionImages.apply(this),
                
                image = this.get("section.image");
            
            if (image && image.src) {
                
                images.unshift({
                    src: image.src,
                    name: image.alt || decodeURIComponent(image.src).split("/").pop().replace(/[0-9]+-/, "")
                });
            }
            
            return images;
        }

    });

}));
