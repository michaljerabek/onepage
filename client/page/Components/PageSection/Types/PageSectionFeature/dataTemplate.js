/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

module.exports = function (lang) {

    var data = {
        type: "PageSectionFeature"
    };

    data.layout = "right-top";

    data.name = {};
    data.name[lang] = "Vlastnost produktu";

    data.title = {};
    data.title[lang] = "Náš produkt umí všechno";

    data.content = {};
    data.content[lang] = "Informace o tom, jak je náš produkt nejlepší.";

    return data;
};
