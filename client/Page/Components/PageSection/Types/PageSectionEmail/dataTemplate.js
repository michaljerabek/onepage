/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

module.exports = function (lang) {

    var data = {
        type: "PageSectionEmail"
    };

    data.name = {};
    data.name[lang] = "Registrace emailu";

    data.title = {};
    data.title[lang] = "Sekce pro registrování emailů";

    data.subtitle = {};
    data.subtitle[lang] = "Zde se může uživatel zaregistrovat například pro odběr newsletteru.";

    data.input = {
        placeholder: {}
    };

    data.input.placeholder[lang] = "@";

    data.button = {
        text: {}
    };

    data.button.text[lang] = "Odeslat";

    return data;
};
