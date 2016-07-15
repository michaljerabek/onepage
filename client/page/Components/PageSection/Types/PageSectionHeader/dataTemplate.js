/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

module.exports = function (lang) {

    var data = {
        type: "PageSectionHeader",
        fullSize: true
    };

    data.name = {};
    data.name[lang] = "Úvod";

    data.title = {};
    data.title[lang] = "Toto je vaše nová stránka!";

    data.subtitle = {};
    data.subtitle[lang] = "Pro umístění nové sekce do stránky klikněte na <i>+ Přidat sekci</i>. Obrázky na pozadí je možné nahrát přetažením souboru do okna prohlížeče.";

    return data;
};
