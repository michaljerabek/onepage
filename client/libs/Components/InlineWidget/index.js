/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
var Ractive = require("ractive");

module.exports = Ractive.extend({

    template: require("./index.tpl"),

    CLASS: {
        self: "InlineWidget",

        wrapper: "InlineWidget--wrapper",
        scrollingContent: "InlineWidget--scrolling-content",

        resizer: "InlineWidget--resizer",
        resizerActive: "InlineWidget--resizer__active",
        resizableBox: "InlineWidget--resizable-box",

        minmax: "InlineWidget--min-max",
        minmaxMax: "InlineWidget--min-max__max",
        minmaxMin: "InlineWidget--min-max__min"
    },

    components: {
    },

    partials: {
    },

    decorators: {
        ResizableBox: require("./../../Decorators/ResizableBox")
    },

    data: function () {

        return {

        };
    },

    onconfig: function () {

    },

    onrender: function () {

    },

    oncomplete: function () {
    },


});
