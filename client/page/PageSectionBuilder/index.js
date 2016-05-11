/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

var slug = require("slugg");

var DEF_SECTION_NAME = "sekce";
var DEF_SECTION_INT_ID_PREFIX = "section-";

module.exports = (function () {

    var page,

        counter = 0,

        generateId = function (name, counter) {

            name = name || DEF_SECTION_NAME;

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

        generateName = function (name, counter, originalName) {

            var sections = page.findAllPageSections(),
                s = sections.length - 1;

            counter = counter || 2;

            for (s; s >= 0; s--) {

                if (sections[s].get("name") === name) {

                    return generateName((originalName || name) + " " + counter, ++counter, originalName || name);
                }
            }

            return name;
        },

        generateInternalId = function () {

            return DEF_SECTION_INT_ID_PREFIX + Date.now() + (counter++);
        },

        create = function (type, rewriteData) {

            var superDataTemplate = require("./../Components/PageSection/dataTemplate.js")(),
                dataTemplate = require("./../Components/PageSection/Types/" + type + "/dataTemplate.js")();

            dataTemplate.name = generateName(dataTemplate.name);

            var base = {
                id: generateId(dataTemplate.name),
                internalId: generateInternalId()
            };

            return $.extend(true, base, superDataTemplate, dataTemplate, rewriteData);
        },

        getDefaultName = function (sectionType) {

            var dataTemplate = require("./../Components/PageSection/Types/" + sectionType + "/dataTemplate.js")();

            return generateName(dataTemplate.name);
        };

    return function PageSectionBuilder(_page) {

        page = _page;

        return {
            create: create,
            generateId: generateId,
            getDefaultName: getDefaultName
        };
    };

}());
