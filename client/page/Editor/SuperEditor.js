/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

var FixedElement = require("./../../libs/FixedElement");

var MediumEditor = require("medium-editor");

require("./MediumEditorTouchSupport")(MediumEditor);
require("./MediumEditorToolbar")(MediumEditor, FixedElement);
require("./MediumEditorAnchor")(MediumEditor);
require("./MediumEditorEnhence")(MediumEditor);

var SuperEditor = function SuperEditor($editableSelector, getSections, getLang) {

    MediumEditor.extensions.anchor.prototype.getSections =
        MediumEditor.extensions.anchor.prototype.getSections || getSections || function () { return []; };

    MediumEditor.extensions.anchor.prototype.getLang =
        MediumEditor.extensions.anchor.prototype.getLang || getLang || function () { return "cs"; };

    this.$editableSelector = $editableSelector || "[contenteditable='true']";

    this.configure();

    this.init();
};

SuperEditor.prototype.configure = function () {

    this.options = {};
};

SuperEditor.prototype.init = function () {

    clearTimeout(this.initDelay);

    this.editor = new MediumEditor($(this.$editableSelector), this.options);

    this.$toolbar = $(this.editor.toolbar && this.editor.toolbar.toolbar);
};

SuperEditor.prototype.destroy = function () {

    clearTimeout(this.initDelay);

    if (this.editor) {

        this.editor.destroy();
    }
};

SuperEditor.prototype.refresh = function (delayRefresh, delay) {

    clearTimeout(this.initDelay);

    if (delayRefresh/* && this.editor && this.editor.elements.length*/) {

        this.initDelay = setTimeout(this.refresh.bind(this), delay || 300);
//
//        var editables = $(this.$editableSelector).get(),
//
//            add = [],
//            remove = [],
//
//            newCount = editables.length - 1,
//            currentCount = this.editor.elements.length - 1;
//
//        for (newCount; newCount >= 0; newCount--) {
//
//            if (this.editor.elements.indexOf(editables[newCount]) === -1) {
//
//                add.push(editables[newCount]);
//            }
//        }
//
//        for (currentCount; currentCount >= 0; currentCount--) {
//
//            if (editables.indexOf(this.editor.elements[currentCount]) === -1) {
//
//                remove.push(this.editor.elements[currentCount]);
//            }
//        }
//
//        this.editor.removeElements(remove);
//        this.editor.addElements(add);
//
//        var toolbar = this.editor.getExtensionByName("toolbar");
//
//        if (toolbar) {
//
//            toolbar.destroy();
//        }
//
//        setTimeout(function() {
//
//            if (toolbar) {
//
//                toolbar.init();
//            }
//
//        }.bind(this), 100);

        return;
    }

    this.destroy();

    this.init();
};

SuperEditor.BUTTONS = {
    H2: {
        name: "h2",
        aria: "Nadpis"
    },
    I: {
        name: "italic",
        aria: "Kurzíva"
    },
    B: {
        name: "bold",
        aria: "Tučné"
    },
    UL: {
        name: "unorderedlist",
        aria: "Odrážkový seznam"
    },
    OL: {
        name: "orderedlist",
        aria: "Číslovaný seznam"
    },
    SUP: {
        name: "superscript",
        aria: "Horní index"
    },
    SUB: {
        name: "subscript",
        aria: "Dolní index"
    },
    A: {
        name: "anchor",
        aria: "Odkaz"
    }
};

SuperEditor.MediumEditor = MediumEditor;

module.exports = SuperEditor;
