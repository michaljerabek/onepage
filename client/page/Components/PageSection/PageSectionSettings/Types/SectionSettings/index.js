/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageSectionSettings = require("./../../../PageSectionSettings"),

            template = require("./index.tpl");

        module.exports = factory(PageSectionSettings, template);

    } else {

        root.ColorSettings = factory(root.PageSectionSettings, root.ColorPicker, root.ColorPickerPalette, "");
    }

}(this, function (PageSectionSettings, template) {

    return PageSectionSettings.extend({

//        template: template,

        components: {
        },

        partials: {
            pageSectionSettingsContent: template
        },

        data: function () {

            return {
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
            this.superOnteardown();
        }
    });

}));

