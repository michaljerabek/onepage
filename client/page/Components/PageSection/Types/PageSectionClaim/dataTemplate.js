/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

module.exports = function (lang) {

    var data = {
        type: "PageSectionClaim",
        fullSize: false
    };


    data.layout = "content";

    data.name = {};
    data.name[lang] = "Tvrzení o nabídce";

    data.title = {};
    data.title[lang] = "&#8222;Tvrzení&#8220; o nabídce";

    data.subtitle = {};
    data.subtitle[lang] = "Vhodné pro velmi důležitou vlastnost nabídky. Sekci je možné roztáhnout přes celé okno prohlížeče.";

    return data;
};
