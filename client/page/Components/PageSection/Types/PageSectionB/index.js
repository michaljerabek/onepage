/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var SuperPageSectionType = require("./../SuperPageSectionType");

module.exports = SuperPageSectionType.extend({

    template: require("./index.tpl"),

    components: {
    },

    onrender: function () {
    },

    onconfig: function () {
        this.superOnconfig();
    }

});
