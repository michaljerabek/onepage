/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var SuperPageSectionType = require("./../SuperPageSectionType");

module.exports = SuperPageSectionType.extend({

//    template: require("./index.tpl"),
    template: "<div class='E_Editor__title' style='background: {{.section.background}}; color: {{.section.color}};' contenteditable='{{!!editMode}}' value='{{.section.name}}'></div>",

    partials: {
    },

    components: {
    },

    onrender: function () {
    },

    onconfig: function () {

    }

});
