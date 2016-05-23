/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageSectionSettings = require("./../../../PageSectionSettings");

        module.exports = factory(PageSectionSettings);

    } else {

        root.BackgroundImageSettings = factory(root.PageSectionSettings);
    }

}(this, function (PageSectionSettings) {

    return PageSectionSettings.extend({

//        template: require("./index.tpl"),

        data: {
            data: {}
        },

        components: {
            BackgroundImageBrowser: require("./../../../../../../libs/Components/FileBrowser/ImageBrowser")
        },

        partials: {
            pageSectionSettingsContent: require("./index.tpl")
        },

        onconfig: function () {

            this.superOnconfig();

        },

        oncomplete: function () {

            this.superOncomplete();

        },

        onteardown: function () {

            this.superOnteardown();

        },

        onrender: function () {

            this.superOnrender();

            this.on("BackgroundImageBrowser.selectFile", function (event, file) {

                if (file && file.path) {

                    this.set("data.backgroundImage.src", file.path);
                }

            }, {context: this});

        }

    });

}));

