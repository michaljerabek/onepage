/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

module.exports = function (lang) {

    var data = {
        type: "PageSectionC"
    };

    data.name = {};
    data.name[lang] = "Sekce C";

    data.title = {};
    data.title[lang] = "Titulek";

    data.content = {};
    data.content[lang] = "Obsah";

    return data;
};
