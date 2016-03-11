/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        module.exports = factory();

    } else {

        root.MediumEditorEnhence = factory();
    }

}(this, function () {

    return function (MediumEditor) {

        MediumEditor.prototype._execAction = MediumEditor.prototype.execAction;

        MediumEditor.prototype.execAction = function (action, skipNestedBlockCheck) {

            var $parentElement,
                selectNewBlock;

            if (!skipNestedBlockCheck && (action === "insertunorderedlist" || action === "insertorderedlist" || "append-h2")) {

                $parentElement = $(this.getSelectedParentElement());
            }

            if (!skipNestedBlockCheck && (action === "insertunorderedlist" || action === "insertorderedlist")) {

                var h2 = $parentElement.is("h2") || $parentElement.parentsUntil(this.origElements, "h2").length;

                if (h2) {

                    this.execAction("append-h2", true);
                }

                selectNewBlock = true;

            } else if (!skipNestedBlockCheck && action === "append-h2") {

                var ol =  $parentElement.is("ol") || $parentElement.parentsUntil(this.origElements, "ol").length;

                if (ol) {

                    this.execAction("insertorderedlist", true);

                } else {

                    var ul =  $parentElement.is("ul") || $parentElement.parentsUntil(this.origElements, "ul").length;

                    if (ul) {

                        this.execAction("insertunorderedlist", true);
                    }
                }
            }

            var original = MediumEditor.prototype._execAction.apply(this, arguments);

            if (!skipNestedBlockCheck && selectNewBlock) {

                this.selectElement(this.getSelectedParentElement());

                this.checkSelection();
            }

            return original;
        };

    };

}));
