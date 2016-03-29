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

    this.options = {

        anchor: {
            linkValidation: true
        },
        anchorPreview: false,

        disableExtraSpaces: true,
        disableDoubleReturn: true,

        imageDragging: false,
        placeholder: false,
        keyboardCommands: false,

        buttonLabels: "fontawesome",

        toolbar: {
            buttons: [
                SuperEditor.BUTTONS.H2,
                SuperEditor.BUTTONS.OL,
                SuperEditor.BUTTONS.UL,
                SuperEditor.BUTTONS.B,
                SuperEditor.BUTTONS.I,
                SuperEditor.BUTTONS.A,
                SuperEditor.BUTTONS.SUB,
                SuperEditor.BUTTONS.SUP
            ]
        }
    };
};

ContentEditor.prototype.init = function () {

    SuperEditor.prototype.init.apply(this, arguments);

    if (!this.editor.elements.length) {

        return;
    }

    this.editor.subscribe("editableKeydownEnter", function () {
        this.editableKeydownEnter = true;
    }.bind(this));

    this.editor.subscribe("editableInput", function (e, editorElement) {

        this.cleanPInH2AndH2InP.apply(this, arguments);

        if (!this.editableKeydownEnter) {

            return;
        }

        this.editableKeydownEnter = false;

        setTimeout(function() {

            try {

                var data = this.checkIfListShouldBeCreated.apply(this, arguments);

                if (data) {

                    this.createList(data, editorElement);
                }
            } catch (e) {}
        }.bind(this), 0);

    }.bind(this));
};

ContentEditor.prototype.checkIfListShouldBeCreated = function () {

    var anchor = document.getSelection().anchorNode;

    anchor = SuperEditor.MediumEditor.util.getClosestBlockContainer(anchor);

    var testedElement,
        removeNext; //smazat element ("enter"), který následuje po testovaném

    //Chrome fix - někdy se může text nacházet v <div />
    if (anchor && anchor !== this.editor.getFocusedElement() && anchor.querySelector("div")) {

        anchor =  anchor.querySelector("div");

        testedElement = "self";

        removeNext = true;

    } else if (anchor === this.editor.getFocusedElement() && anchor.children[0] && !anchor.children[0].tagName.match(/h2/i) && !anchor.children[0].querySelector("h2")) {

        testedElement = "self";

    } else if (anchor.previousElementSibling && !anchor.previousElementSibling.tagName.match(/li|h2/i) && !anchor.previousElementSibling.querySelector("li, h2")) {

        testedElement = "prev";
    }

    if (!testedElement) {

        return false;
    }

    var testedText = (testedElement === "self" ? anchor : anchor.previousElementSibling).innerText.trim(),

        matchesUl = testedText.match(/^-/),
        matchesOl = testedText.match(/^[0-9]+(?:\. ?\)?| ?\))/);/*1., 1.), 1. ), 1), 1 )*/

    return matchesUl || matchesOl ? {
        ul: matchesUl,
        ol: matchesOl,
        anchor: anchor,
        testedElement: testedElement,
        removeNext: removeNext
    } : false;
};

ContentEditor.prototype.createList = function (data, editorElement) {

    this.$toolbar.css({
        animationDuration: "0s"
    });

    //označit předchozí text
    this.editor.selectElement((data.testedElement === "self" ? data.anchor : data.anchor.previousElementSibling));

    //vložit seznam
    this.editor.execAction(data.ul ? "insertunorderedlist" : "insertorderedlist");

    //najít vytvořený li
    var li = (data.testedElement === "self" ? data.anchor : data.anchor.previousElementSibling || editorElement).querySelector("li:last-child");

    //odstranit znak určiující, že jde o seznam
    li.innerText = li.innerText.replace(data.ul ? /^\s*-\s*/ : /^\s*[0-9]+(?:\. ?\)?| ?\))\s*/, "");

    //přidat nový li
    if ((data.testedElement === "self" ? data.anchor : data.anchor.previousElementSibling || editorElement).querySelectorAll("li").length === 1) {

        li.outerHTML += "<li></li>";
    }

    //vybrat poslední li
    this.editor.selectElement((data.testedElement === "self" ? data.anchor : data.anchor.previousElementSibling || editorElement).querySelector("li:last-child"));

    var selected = this.editor.getSelectedParentElement();

    //přesunout kurzor na konec posledního li
    document.getSelection().collapse(selected, selected.innerText.length ? 1 : 0);

    //smazat polední enter
    if (data.anchor !== this.editor.getFocusedElement()) {

        (data.testedElement === "self" ? data.anchor : data.anchor.previousElementSibling || editorElement).parentNode.removeChild(data.removeNext ? data.anchor.nextElementSibling : data.anchor);
    }

    this.$toolbar.css({
        animationDuration: ""
    });

};

ContentEditor.prototype.cleanPInH2AndH2InP = function (e, editorElement) {

    var $editorElement = $(editorElement),

        $pInH2 = $editorElement.find("h2 p");

    if ($pInH2.length) {

        $pInH2.unwrap();

        this.editor.selectElement($pInH2[0]);

        return;
    }

    var $h2InP = $editorElement.find("p h2");

    if ($h2InP.length) {

        $h2InP.unwrap();

        this.editor.selectElement($h2InP[0]);

        return;
    }

};

module.exports = ContentEditor;
