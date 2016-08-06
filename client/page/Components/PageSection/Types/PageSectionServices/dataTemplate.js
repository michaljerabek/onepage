/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

var PageElementService = require("./../../../PageElement/Types/PageElementService");

module.exports = function (lang) {

    var data = {
        type: "PageSectionServices"
    };

    data.layout = "center";

    data.name = {};
    data.name[lang] = "Popis nabízených služeb";

    data.title = {};
    data.title[lang] = "Popis nabízených služeb";

    data.subtitle = {};
    data.subtitle[lang] = "Ikony v sekci je možné zarovnat na střed s textem nebo vlevo vedle textu.";

    data.items = [
        PageElementService.prototype.getNewItem(lang),
        PageElementService.prototype.getNewItem(lang),
        PageElementService.prototype.getNewItem(lang)
    ];

    data.items[0].title[lang] = "Služba 1";
    data.items[1].title[lang] = "Služba 2";
    data.items[2].title[lang] = "Služba 3";

    data.items[0].content[lang] = "Krátký popis služby nebo vlastnosti nabídky 1.";
    data.items[1].content[lang] = "Krátký popis služby nebo vlastnosti nabídky 2.";
    data.items[2].content[lang] = "Krátký popis služby nebo vlastnosti nabídky 3.";

    return data;
};
