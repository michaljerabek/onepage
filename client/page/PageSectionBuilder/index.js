/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

var slug = require("slugg");

var DEF_SECTION_NAME = "sekce";
var DEF_SECTION_INT_ID_PREFIX = "__section-";

module.exports = (function () {

    var page,

        counter = 0,

        generateId = function (name, lang, counter) {

            name = name || DEF_SECTION_NAME;

            var id = slug(counter ? name + "-" + counter : name),

                sections = page.findAllPageSections(),
                s = sections.length - 1;

            counter = counter || 1;

            for (s; s >= 0; s--) {

                if (sections[s].get("id." + lang) === id) {

                    return generateId(name, lang, ++counter);
                }
            }

            return id;
        },

        generateName = function (name, lang, counter, originalName) {

            var sections = page.findAllPageSections(),
                s = sections.length - 1;

            counter = counter || 2;

            for (s; s >= 0; s--) {

                if (sections[s].get("name")[lang] === name) {

                    return generateName((originalName || name) + " " + counter, lang, ++counter, originalName || name);
                }
            }

            return name;
        },

        generateInternalId = function () {

            return DEF_SECTION_INT_ID_PREFIX + Date.now() + (counter++);
        },

        create = function (type, rewriteData) {

            var lang = page.get("page.lang"),

                superDataTemplate = require("./../Components/PageSection/dataTemplate.js")(lang),
                dataTemplate = require("./../Components/PageSection/Types/" + type + "/dataTemplate.js")(lang);

            dataTemplate.name[lang] = generateName(dataTemplate.name[lang], lang);

            var base = {
                id: {},
                internalId: generateInternalId()
            };

            base.id[lang] = generateId(dataTemplate.name[lang], lang);

            return $.extend(true, base, superDataTemplate, dataTemplate, rewriteData);
        },

        getDefaultName = function (sectionType) {

            var lang = page.get("page.lang"),
                dataTemplate = require("./../Components/PageSection/Types/" + sectionType + "/dataTemplate.js")(lang);

            return generateName(dataTemplate.name[lang], lang);
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
