/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

var PageElementFact = require("./../../../PageElement/Types/PageElementFact");

module.exports = function (lang) {

    var data = {
        type: "PageSectionFactsNumbers"
    };

    data.name = {};
    data.name[lang] = "Fakty o nabídce";

    data.title = {};
    data.title[lang] = "Fakty o nabídce";

    data.subtitle = {};
    data.subtitle[lang] = "Základní fakty o nabídce prezentované pomocí čísel.";

    data.items = [
        PageElementFact.prototype.getNewItem(lang, "number"),
        PageElementFact.prototype.getNewItem(lang, "number"),
        PageElementFact.prototype.getNewItem(lang, "number")
    ];

    data.items[0].text[lang] = "Fakt 1";
    data.items[1].text[lang] = "Fakt 2";
    data.items[2].text[lang] = "Fakt 3";

    data.items[0].number[lang] = "1";
    data.items[1].number[lang] = "2";
    data.items[2].number[lang] = "3";

    return data;
};
