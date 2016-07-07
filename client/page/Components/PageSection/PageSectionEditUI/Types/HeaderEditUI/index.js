/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),
            EditUI = require("./../../index.js"),

            partials = {
//                pageSectionEditUIContent: require("./partials/content.tpl"),
//                EditUIControlsTopLeft: require("./partials/top-left.tpl"),
//                EditUIControlsTopRight: require("./partials/top-right.tpl"),
//                EditUIControlsBottomLeft: require("./partials/bottom-left.tpl"),
//                EditUIControlsBottomRight: require("./partials/bottom-right.tpl"),
//
//                FlatButton: require("./../../UI/FlatButton/index.tpl")
            };

        module.exports = factory(Ractive, EditUI);

    } else {

        root.BasicEditUI = factory(root.Ractive, root.EditUI);
    }

}(this, function (Ractive, EditUI) {
    return EditUI.extend({

        EDIT_UI: true,

//        partials: partials || {},

        data: function () {

            return {
                TopLeftEditUI: false,
                TopRightEditUI: false
            };
        },

        onconfig: function () {
            this.superOnconfig();
        },

        onrender: function () {
            this.superOnrender();
        },

        oncomplete: function () {
            this.superOncomplete();
        },

        onteardown: function () {
            this.superOnteardown();
        }
    });

}));

