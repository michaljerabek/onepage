/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
var on = require("./../../../../helpers/on");
var EventEmitter = require("./../../../libs/EventEmitter")();

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

    PAGE_SECTION: true,

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
        PageSectionSettings: require("./PageSectionSettings"),

        PageElementSettings: require("./../PageElement/PageElementSettings"),

        PageElementTitle: require("./../PageElement/Types/PageElementTitle"),
        PageElementTextContent: require("./../PageElement/Types/PageElementTextContent")
    },

    partials: {
        pageSectionEditUI: "",
        pageSectionContent: "",
        pageSectionSettings: "",

        ColorSettings: require("./partials/settings/color-settings.tpl")
    },

    superOnconfig: function () {

        this.observe("section.name", this.regenerateId, {init: false, defer: true});

        this.initPageElementSettings();
        this.initPageSectionSettings();
    },

    initPageElementSettings: function () {

        if (on.client) {

            //otevírá se nastavení elementu v sekci
            EventEmitter.on("openPageElementSettings.PageElement sortPageSection.PageSectionManager", function (e, pageElement) {

                this.updateHasSettingsState(pageElement);

            }.bind(this));
        }
    },

    initPageSectionSettings: function () {

        if (on.client) {

            //otevírá se nastavení sekce -> zavřít ostatní sekce
            EventEmitter.on("openPageSectionSettings.PageSection", function (e, pageSectionType) {

                if (pageSectionType !== this) {

                    this.togglePageSectionSettings(false);
                }
            }.bind(this));
        }

        //Zjišťuje, jestli je jiné nastavení této sekce otevřené.
        //Pokud se otevírá nastavení sekce a jiné nastavení té samé sekce je už otevřené, nastavení se otevře až po zavření již otevřeného.
        this.observe("openPageSectionSettings", function (now, before) {

            this.set("anotherSettingsOpened", !!before);

        }, {init: false});

        //uživatel chce otevřít nastavení sekce
        this.on("*.openPageSectionSettings", function (event, type) {

            type = type === this.get("openPageSectionSettings") ? false : type;

            this.togglePageSectionSettings(type);

            if (type) {

                EventEmitter.trigger("openPageSectionSettings.PageSection", this);
            }
        });

        //Uživatel kliknul na "zavřít" v nastavení.
        this.on("PageSectionSettings.closeThisSettings", this.togglePageSectionSettings.bind(this, false));
    },

    superOnteardown: function () {

        this.off("PageSectionSettings.closeThisSettings");
        this.off("PageSectionEditUI.openPageSectionSettings");
    },

    superOnrender: function () {
    },

    superOncomplete: function () {
    },

    updateHasSettingsState: function (pageElement) {

        var state  = this.get("openPageSectionSettings") || (pageElement && pageElement.get("openPageElementSettings"));

        this.getSectionElement().classList[state ? "add" : "remove"](this.CLASS.hasSettings);
    },

    togglePageSectionSettings: function (state) {

        this.set("openPageSectionSettings", state);

        this.updateHasSettingsState();
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
