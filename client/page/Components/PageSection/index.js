/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
var on = require("./../../../../helpers/on");

var Ractive = require("ractive");

/*
 * Obalovací komponent pro každou sekci.
 *
 * Typový komponent každé sekce se musí zaregistrovat zde v "components", podle jejího "type" v datech.
 * Aby bylo možné vybírat typ komponentu, je potřeba typ sekce zaregistrovat i jako "partial",
 * který bude obsahovat element komponentu s atributem "section", do kterého se vloží data sekce:
 * "<PageSectionA section='{{.section}}' />"
 *
 * Každé sekci se přidají komponenty "PageSectionSettings" (nastavení sekce) pomocí "partialu", který se zaregistruje
 * jako "type" sekce + "Settings" (string). "Partial" musí obsahovat podmínku, podle které se zjistí, zda má být dané
 * nastaveni ("PageSectionSettings") otevřeno. ("Partial" by měl být uložení uvnitř složky dané sekce jako "page-section-settings.tpl")
 * Zde je také možné zaregistrovat jednotlivé "partials" s elementy "PageSectionSettings".
 * Tyto "partials" jsou pak použité v "partials" pro nastavení jednotlivých sekcí ("type" sekce + "Settings").
 *
 * Každá sekce má také komponent "PageSectionEditUI" (ovládácí prvky sekce). Jejich obsah se určuje podle typu
 * sekce - nalezení sprvného typu zajišťuje komponent sám.
 **/

module.exports = Ractive.extend({

    template: require("./index.tpl"),

    CLASS: {
        self: "P_PageSection",
        hasSettings: "P_PageSection__has-settings",

        innerWrapper: "P_PageSection--inner-wrapper",

        //Seřazování sekcí
        parentOfSortable: "P_sortable-sections",
        parentOfNonSortable: "P_nonsortable-sections",
        sortHandle: "P_PageSection--sort-handle",
        draggedSection: "P_PageSection__dragged",
        placedSection: "P_PageSection__placed",
        removedSection: "P_PageSection__removed",

        placeholderTransitions: "P_PageSection--placeholder__transitions",
        placeholder: "P_PageSection--placeholder"
    },

    components: {
        PageSectionA: require("./Types/PageSectionA"),
        PageSectionB: require("./Types/PageSectionB"),
        PageSectionC: require("./Types/PageSectionC"),

        PageSectionSettings: require("./PageSectionSettings"),
        PageSectionEditUI: require("./PageSectionEditUI"),

        PageElementTitle: require("./../PageElement/Types/PageElementTitle")
    },

    partials: {
        PageSectionA: "<PageSectionA section='{{.section}}' />",
        PageSectionB: "<PageSectionB section='{{.section}}' />",
        PageSectionC: "<PageSectionC section='{{.section}}' />",

        PageSectionASettings: require("./Types/PageSectionA/page-section-settings.tpl"),
        PageSectionBSettings: require("./Types/PageSectionB/page-section-settings.tpl"),
        PageSectionCSettings: require("./Types/PageSectionC/page-section-settings.tpl"),

        ColorSettings: require("./Types/SuperPageSectionType/partials/color-settings.tpl")
    },

    onconfig: function () {

        this.observe("section.name", this.regenerateId, {init: false, defer: true});

        //Když se otevírá nastavení sekce, je potřeba zavřít již otevřené nastavení
        this.observe("openPageSectionSettings", this.closeOtherOpenedSettings, {init: false});

        //Zjišťuje, jestli je jiné nastavení této sekce otevřené.
        //Pokud se otevírá nastavení sekce a jiné nastavení té samé sekce je už otevřené, nastavení se otevře až po zavření již otevřeného.
        this.observe("openPageSectionSettings", function (now, before) {

            this.fire("sectionHasSettings", now);

            this.set("anotherSettingsOpened", !!before);

        }, {init: false});

        //uživatel chce otevřít nastavení sekce
        this.on("PageSectionEditUI.openPageSectionSettings", function (type) {

            this.set(
                "openPageSectionSettings",
                type === this.get("openPageSectionSettings") ? false : type
            );
        });

        //Uživatel kliknul na "zavřít" v nastavení.
        this.on("PageSectionSettings.closeThisSettings", function () {

            this.set("openPageSectionSettings", false);
        });

        //označení sekce, pokud je v sekci otevřeno nastavení -> kvůli z-indexu
        this.on("*.sectionHasSettings sectionHasSettings", function (state) {

            this.getSectionElement().classList[state ? "add" : "remove"](this.CLASS.hasSettings);
        });
    },

    onteardown: function () {

        this.off("PageSectionSettings.closeThisSettings");
        this.off("PageSectionEditUI.openPageSectionSettings");
    },

    onrender: function () {
    },

    regenerateId: function (newName) {

        if (!newName) {

            return;
        }

        var builder = this.findParent("Page").pageSectionBuilder;

        this.set("section.id", builder.generateId(newName));

        this.rewriteNameReferences(newName);
    },

    rewriteNameReferences: function (name) {

        var id = this.get("section.internalId");

        $("[value='#" + id + "'], [data-value='#" + id + "']")
            .text($("<span>").html(name).text());
    },

    //Když se otevírá nastavení sekce, je potřeba zavřít již otevřené nastavení
    //(observer) openThis -> má se nastevení této sekce otevřít?
    closeOtherOpenedSettings: function (openThis) {

        if (!openThis) {

            return;
        }

        var siblingSections = this.findSiblingComponents("PageSection"),
            s = siblingSections.length - 1;

        for (s; s > -1; s--) {

            siblingSections[s].set("openPageSectionSettings", false);
        }
    },

    //Vrátí současnou pozici sekce na stránce.
    getCurrentIndex: function () {

        return this.get$SectionElement().index();
    },

    getSectionElement: function () {

        this.sectionElement = this.sectionElement || this.find("." + this.CLASS.self);

        return this.sectionElement;
    },

    get$SectionElement: function () {

        this.$sectionElement = this.$sectionElement || $(this.getSectionElement());

        return this.$sectionElement;
    }

});
