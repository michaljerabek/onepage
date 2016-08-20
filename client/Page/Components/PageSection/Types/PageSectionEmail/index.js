/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            PageSection = require("./../../"),

            components = {
                BasicEditUI: require("./../../PageSectionEditUI/"),

                PageElementEmail: require("./../../../PageElement/Types/PageElementEmail")
            },

            partials = {
                pageSectionContent: require("./index.tpl"),
                pageSectionSettings: require("./page-section-settings.tpl"),
                pageSectionEditUI: "<BasicEditUI section='{{.section}}' />"
            };

        module.exports = factory(Ractive, PageSection, components, partials);

    } else {

        root.PageSectionServices = factory(root.Ractive, root.PageSection);
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

        },

        oncomplete: function () {

            this.superOncomplete();
        },

        onteardown: function () {

            this.superOnteardown();
        },

        setDefaultValues: function () {

        },

        getTextPaths: function () {

            var paths = PageSection.prototype.getTextPaths.apply(this);

            paths = paths.concat(["title", "subtitle", "button.text", "input.placeholder"]);

            return paths;
        },

        getColorPaths: function () {

            var paths = PageSection.prototype.getColorPaths.apply(this);

            paths.push("button.color");
            paths.push("button.userTextColor");

            return paths;
        }

    });

}));
