/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var U = require("./../../libs/U");
var CLASS = require("./../CLASSNAMES");

var SuperEditor = require("./SuperEditor");

var TitleEditor = function TitleEditor() {

    SuperEditor.apply(this, arguments);
};

U.extend(TitleEditor, SuperEditor);

TitleEditor.prototype.configure = function () {

    this.options = {

        anchor: {
            linkValidation: true
        },
        anchorPreview: false,

        disableReturn: true,
        disableExtraSpaces: true,

        imageDragging: false,
        placeholder: false,
        keyboardCommands: false,

        buttonLabels: "fontawesome",

        toolbar: {
            buttons: [
                SuperEditor.BUTTONS.B,
                SuperEditor.BUTTONS.I,
                SuperEditor.BUTTONS.A,
                SuperEditor.BUTTONS.SUB,
                SuperEditor.BUTTONS.SUP
            ]
        }
    };
};

module.exports = TitleEditor;
