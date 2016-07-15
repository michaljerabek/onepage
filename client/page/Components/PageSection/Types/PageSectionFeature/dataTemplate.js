/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

module.exports = function (lang) {

    var data = {
        type: "PageSectionFeature"
    };

    data.layout = "left-center";

    data.image = {
        src: "/img/img-sample.png"
    };

    data.name = {};
    data.name[lang] = "Informace o nabídce";

    data.title = {};
    data.title[lang] = "<p>Informace o nabídce</p>";

    data.content = {};
    data.content[lang] = "<p>Zde může být například popis nějaké vlastnosti nabídky nebo funkce produktu. Sekce může obsahovat obrázek a až tři tlačítka.</p><h2>Možnosti zarovnání obsahu</h2><ul><li>text může být vedle obrázku vlevo nebo vpravo</li><li>text může být nad nebo pod brázkem</li></ul><p>Pokud je text vedle obrázku, může být vertikálně zarovnán nohoru, dolů nebo doprostřed. Pokud je blok textu vyšší než obrázek, obrázek bude zarovnán podle tohoto nastavení. Na menších obrazovkách se obsah bude zobrazovat pod sebou.</p><h2>Obrázek</h2><p>Obrázek je možné přidat přesunutím souboru do okna prohlížeče na vyhrazené místo.</p>";

    return data;
};
