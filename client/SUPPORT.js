/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var SUPPORT = {

    TRANSITIONEND: (function () {

        var el = document.createElement("div"),

            transitions = [
                "transition"      , "transitionend"      ,
                "OTransition"     , "otransitionend"     ,
                "MozTransition"   , "transitionend"      ,
                "WebkitTransition", "webkitTransitionEnd"
            ],

            i = 0, length = transitions.length;

        for (i; i < length; i += 2) {

            if (el.style[transitions[i]] !== undefined) {

                return transitions[i + 1];
            }
        }

        return null;

    }())
};

module.exports = SUPPORT;
