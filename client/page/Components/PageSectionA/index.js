/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var PageSectionMaster = require("./../PageSectionMaster");

module.exports = PageSectionMaster.extend({

//    template: require("./index.tpl"),
    template: "{{.section.name}}",

    components: {
    },

    onrender: function () {

    },

    onconfig: function () {

    }

});
