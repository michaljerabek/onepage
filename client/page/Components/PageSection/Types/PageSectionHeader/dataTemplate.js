/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

module.exports = function (lang) {

    var data = {
        type: "PageSectionHeader",
        fullSize: true
    };

    data.name = {};
    data.name[lang] = "Úvod";

    data.title = {};
    data.title[lang] = "Vítejte na našich stránkách!";

    data.subtitle = {};
    data.subtitle[lang] = "Vytvořte si vlastní stránku snadno a rychle a začněte vydělávat miliony!";

    return data;
};
