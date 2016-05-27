/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var PageSection = require("./../../");

module.exports = PageSection.extend({

    partials: {
        pageSectionContent: require("./index.tpl"),
        pageSectionSettings: require("./page-section-settings.tpl"),
        pageSectionEditUI: "<BasicEditUI section='{{.section}}' />"
    },

    components: {
        BasicEditUI: require("./../../PageSectionEditUI")
    },

    onrender: function () {
        this.superOnrender();
    },

    onteardown: function () {
        this.superOnteardown();
    },

    oncomplete: function () {
        this.superOncomplete();
    },

    onconfig: function () {
        this.superOnconfig();
    },

    getTextPaths: function () {

        var paths = PageSection.prototype.getTextPaths.apply(this);

        paths = paths.concat(["title", "content"]);

        return paths;
    }

});

