/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/clearInterval
/*global $*/

var CLASS = require("./../../CLASSNAMES");

module.exports = (function () {

    var page,

        getSectionsSortedByIndex = function () {

            var pageSections = page.findAllPageSections(),

                sections = [],
                s = pageSections.length - 1;

            for (s; s >= 0; s--) {

                sections[pageSections[s].getCurrentIndex()] = pageSections[s].get("section");
            }

            return sections;
        };

    return function (pageComponent) {

        page = pageComponent;

        $("." + CLASS.PageSections.parentOfSortable).sortable({
            items: "." + CLASS.PageSections.section,
            onlyYDir: true,
            fixedX: true,
            handle: "." + CLASS.PageSections.sortHandle
        });

        return {
            getSectionsSortedByIndex: getSectionsSortedByIndex
        };
    };

}());
