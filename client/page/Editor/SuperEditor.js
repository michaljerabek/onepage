/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

var FixedElement = require("./FixedElement");

var MediumEditor = require("medium-editor");

require("./MediumEditorTouchSupport")(MediumEditor);
require("./MediumEditorToolbar")(MediumEditor, FixedElement);
require("./MediumEditorAnchor")(MediumEditor);

var SuperEditor = function SuperEditor(getSections) {

    MediumEditor.extensions.anchor.prototype.getSections =
        MediumEditor.extensions.anchor.prototype.getSections || getSections || function () { return []; };

    this.configure();

    this.init();
};

SuperEditor.prototype.configure = function () {

    this.$editableSelector = "[contenteditable='true']";
    this.options = {};
};

SuperEditor.prototype.init = function () {

    this.editor = new MediumEditor($(this.$editableSelector), this.options);
};

SuperEditor.prototype.destroy = function () {

    if (this.editor) {

        this.editor.destroy();
    }
};

SuperEditor.prototype.refresh = function () {

    this.destroy();

    this.init();
};

module.exports = SuperEditor;
