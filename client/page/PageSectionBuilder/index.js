/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

var slug = require("slugg");

var DEF_SECTION_NAME = "sekce";

module.exports = (function () {

    var page,

        generateId = function (name, counter) {

            var id = slug(counter ? name + "-" + counter : name),

                sections = page.findAllPageSections(),
                s = sections.length - 1;

            counter = counter || 1;

            for (s; s >= 0; s--) {

                if (sections[s].get("id") === id) {

                    return generateId(name, ++counter);
                }
            }

            return id;
        },

        create = function (type, rewriteData) {

            var dataTemplate = require("./../Components/PageSection/Types/" + type + "/dataTemplate.js")();

            var base = {
                id: generateId(dataTemplate.name || DEF_SECTION_NAME)
            };

            return $.extend(true, base, dataTemplate, rewriteData);
        };

    return function PageSectionBuilder(_page) {

        page = _page;

        return {
            create: create,
            generateId: generateId
        };
    };

}());
