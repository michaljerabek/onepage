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

        onconfig: function () {

            this.superOnconfig();

            this.setDefaultValues();
        },

        onrender: function () {

            this.superOnrender();

            if (Ractive.EDIT_MODE) {

                var titles = this.findAllComponents("PageElementTitle");

                this.Title = titles[0];
                this.Subtitle = titles[1];

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
        }

    });

}));
