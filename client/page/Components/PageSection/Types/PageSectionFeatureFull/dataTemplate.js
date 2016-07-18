/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

module.exports = function (lang) {

    var data = {
        type: "PageSectionFeatureFull",
        fullSize: true
    };

    data.layout = "center-center";

    data.name = {};
    data.name[lang] = "Informace o nabídce";

    data.title = {};
    data.title[lang] = "Informace o nabídce";

    data.content = {};
    data.content[lang] = "Sekce se roztáhne minimálně přes celé okno prohlížeče (v případě, že je šířka větší než výška). Na menších obrazovkách se zobrazí text nad nebo pod obrázkem (<i>pozadím</i>) uprostřed (s výjimkou rozložení <i>Uprostřed &#8211; Uprostřed</i>). Nastavte proto také barvu pozadí.";

    return data;
};
