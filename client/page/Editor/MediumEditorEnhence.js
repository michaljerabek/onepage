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

        MediumEditor.prototype.execAction = function () {

            var original = MediumEditor.prototype._execAction.apply(this, arguments);

            return original;
        };

    };

}));
