/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
var U = require("./../../libs/U");
var CLASS = require("./../CLASSNAMES");

var SuperEditor = require("./SuperEditor");

var ContentEditor = function ContentEditor() {

    SuperEditor.apply(this, arguments);
};

U.extend(ContentEditor, SuperEditor);

ContentEditor.prototype.configure = function () {

    this.$editableSelector = "." + CLASS.PageSection.contentEditor;

    this.options = {

        anchorPreview: false,
        imageDragging: false,
        placeholder: false,
        keyboardCommands: false,

        buttonLabels: "fontawesome",

        toolbar: {
            buttons: ["h2", "bold", "italic", "anchor", "orderedlist", "unorderedlist", "subscript", "superscript"]
        }
    };
};

ContentEditor.prototype.init = function () {

    SuperEditor.prototype.init.apply(this, arguments);

    if (!this.editor.elements.length) {

        return;
    }

    this.editor.subscribe("editableInput", function (e, editable) {

        var $editable = $(editable);

        var $pInH2 = $editable.find("h2 p");

        if ($pInH2.length) {

            $pInH2.unwrap();

            this.editor.selectElement($pInH2[0]);

            return;
        }

        var $h2InP = $editable.find("p h2");

        if ($h2InP.length) {

            $h2InP.unwrap();

            this.editor.selectElement($h2InP[0]);

            return;
        }

    }.bind(this));

};



module.exports = ContentEditor;
