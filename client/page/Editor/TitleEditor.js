/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var CLASS = require("./../CLASSNAMES");

var SuperEditor = require("./SuperEditor");

var TitleEditor = function TitleEditor() {

    SuperEditor.apply(this, arguments);
};

TitleEditor.prototype = new SuperEditor("__inherit");

TitleEditor.prototype.configure = function () {

    this.$editableSelector = "." + CLASS.PageSection.titleEditor;

    this.options = {

        anchorPreview: false,
        imageDragging: false,
        placeholder: false,
        keyboardCommands: false,

        buttonLabels: "fontawesome",

        toolbar: {
            buttons: ["bold", "italic", "anchor"]
        }
    };
};

module.exports = TitleEditor;
