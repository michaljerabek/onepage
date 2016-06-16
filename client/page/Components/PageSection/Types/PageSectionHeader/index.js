/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            PageSection = require("./../../"),

            components = {
                HeaderEditUI: require("./../../PageSectionEditUI/Types/HeaderEditUI")
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
                elementsStates: []
            };
        },

        onconfig: function () {

            this.superOnconfig();

            this.setDefaultValues();


//            this.on("emptyElement *.emptyElement emptyButtons", function (empty, element) {
//
//                var emptyClass,
//                    notEmptyClass;
//
//                if (element === "PageElementButtons") {
//
//                    emptyClass = "has-empty-Buttons";
//                    notEmptyClass = "has-not-empty-Buttons";
//                }
//
//                if (element === this.Title) {
//
//                    emptyClass = "has-empty-Title";
//                    notEmptyClass = "has-not-empty-Title";
//                }
//
//                if (element === this.Subtitle) {
//
//                    emptyClass = "has-empty-Subtitle";
//                    notEmptyClass = "has-not-empty-Subtitle";
//                }
//
//                if (!emptyClass) {
//
//                    return;
//                }
//
//                var states = this.get("elementsStates"),
//
//                    emptyIndex = states.indexOf(emptyClass);
//
//                if (~emptyIndex && !empty) {
//
//                    states.splice(emptyIndex, 1);
//                }
//
//                var notEmptyIndex = states.indexOf(notEmptyClass);
//
//                if (~notEmptyIndex && empty) {
//
//                    states.splice(notEmptyIndex, 1);
//                }
//
//                if ((empty && !~emptyIndex) || (!empty && !~notEmptyIndex)) {
//
//                    states.push(empty ? emptyClass : notEmptyClass);
//                }
//
//            }.bind(this));
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

            if (!this.get("section.layout")) {

                this.set("section.layout", "center");
            }
        },

        getTextPaths: function () {

            var paths = PageSection.prototype.getTextPaths.apply(this);

            paths = paths.concat(["title", "subtitle"]);

            return paths;
        }

    });

}));
