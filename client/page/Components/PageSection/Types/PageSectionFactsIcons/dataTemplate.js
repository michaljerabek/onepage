/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

var PageElementFact = require("./../../../PageElement/Types/PageElementFact");

module.exports = function (lang) {

    var data = {
        type: "PageSectionFactsIcons"
    };

    data.name = {};
    data.name[lang] = "Fakty o nabídce";

    data.title = {};
    data.title[lang] = "Fakty o nabídce";

    data.subtitle = {};
    data.subtitle[lang] = "Základní fakty o nabídce prezentované pomocí ikon.";

    data.items = [
        PageElementFact.prototype.getNewItem(lang),
        PageElementFact.prototype.getNewItem(lang),
        PageElementFact.prototype.getNewItem(lang)
    ];

    data.items[0].text[lang] = "Fakt 1";
    data.items[1].text[lang] = "Fakt 2";
    data.items[2].text[lang] = "Fakt 3";

    return data;
};
