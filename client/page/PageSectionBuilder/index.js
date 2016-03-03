/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

module.exports = (function () {

    var page,

        create = function (type, rewriteData) {

            var dataTemplate = require("./../Components/PageSection/Types/" + type + "/dataTemplate.js");

            return $.extend(true, {}, dataTemplate(), rewriteData);
        };

    return function PageSectionBuilder(_page) {

        page = _page;

        return {
            create: create
        };
    };

}());
