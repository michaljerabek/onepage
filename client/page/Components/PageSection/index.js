/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
var on = require("./../../../../helpers/on");
var EventEmitter = require("./../../../libs/EventEmitter")();

var Ractive = require("ractive");

/*
 * Abstraktní komponent pro vytváření sekcí.
 *
 * Konkrétný typ sekce musí v partials zaregistrovat v "pageSectionContent" obsah sekce,
 * v "pageSectionEditUI" ovládací prvky sekce (komponent rozšiřující PageSectionEditUI - registruje
 * se u konkrtétní sekce) a v "pageSectionSettings" šablona obsahující všechny PageSectionSettings.
 **/

module.exports = Ractive.extend({

    PAGE_SECTION: true,

    template: require("./index.tpl"),

    CLASS: {
        self: "P_PageSection",
        hasSettings: "P_PageSection__has-settings",
        hasOutline: "P_PageSection__has-outline",

        innerWrapper: "P_PageSection--inner-wrapper",

        //Seřazování sekcí
        parentOfSortable: "P_sortable-sections",
        parentOfNonSortable: "P_nonsortable-sections",
        sortHandle: "P_PageSection--sort-handle",
        draggedSection: "P_PageSection__dragged",
        placedSection: "P_PageSection__placed",
        newSection: "P_PageSection__new",
        insertedByTap: "P_PageSection__inserted-by-tap",
        removedSection: "P_PageSection__removed",

        placeholderTransitions: "P_PageSection--placeholder__transitions",
        placeholderFake: "P_PageSection--fake-placeholder",
        placeholder: "P_PageSection--placeholder"
    },

    components: {
        PageSectionSettings: Ractive.EDIT_MODE ? require("./PageSectionSettings") : null,

        PageElementSettings: Ractive.EDIT_MODE ? require("./../PageElement/PageElementSettings") : null,

        PageElement: require("./../PageElement"),
        PageElementTitle: require("./../PageElement/Types/PageElementTitle"),
        PageElementTextContent: require("./../PageElement/Types/PageElementTextContent")
    },

    partials: {
        pageSectionEditUI: "",
        pageSectionContent: "",
        pageSectionSettings: "",

        ColorSettings: Ractive.EDIT_MODE ? require("./partials/settings/color-settings.tpl") : null
    },

    data: function () {

        return {
            editMode: Ractive.EDIT_MODE
        };
    },

    superOnconfig: function () {

        if (Ractive.EDIT_MODE) {

            //při změně jména sekce změnit id
            this.observe("section.name", this.regenerateId, {init: false, defer: true});

            this.initPageElementSettings();
            this.initPageSectionSettings();
        }
    },

    superOnrender: function () {

        if (Ractive.EDIT_MODE) {

            this.initEditUI();
        }
    },

    superOncomplete: function () {
    },

    initEditUI: function () {

        var EditUI,

            components = this.findAllComponents(),
            c = components.length - 1;

        for (c; c >= 0; c--) {

            if (components[c].EDIT_UI) {

                EditUI = components[c];

                break;
            }
        }

        this.EditUI = EditUI;
    },

    initPageElementSettings: function () {

        if (on.client) {

            //otevírá se nastavení elementu v sekci
            EventEmitter.on("openPageElementSettings.PageElement sortPageSection.PageSectionManager", function (e, state, pageElement) {

                this.updateHasSettingsState(pageElement);

            }.bind(this));
        }

        this.on("*.sectionHasOutline", this.updateHasOutlineState.bind(this), {context: this});
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
        this.off("*.sectionHasOutline");
    },

    updateHasSettingsState: function (pageElement) {

        var state  = this.get("openPageSectionSettings") || (pageElement && pageElement.get("openPageElementSettings") && pageElement.getPageSection() === this);

        this.set("hasSettings", state);

        this.getSectionElement().classList[state ? "add" : "remove"](this.CLASS.hasSettings);
    },

    updateHasOutlineState: function (state) {

        if (Boolean(this.currentOutlineState) === Boolean(state)) {

            return;
        }

        this.currentOutlineState = this.find("." + this.components.PageElement.prototype.CLASS.outlineActive);

        this.set("hasOutline", this.currentOutlineState);

        EventEmitter.trigger("hasOutline.PageSection", [state, this.EditUI]);

        this.getSectionElement().classList[this.currentOutlineState ? "add" : "remove"](this.CLASS.hasOutline);
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

    handleHover: function (event) {

        if (this.EditUI) {

            this.EditUI.fire("hover", event, this);
        }
    },

    //uživatel se dotknul sekce -> zobrazit EditUI? -> handleTouchend
    handleTouchstart: function (event) {

        if (event.original.touches.length > 1 || this.EditUI.get("hover")) {

            return;
        }

        this.cancelTouchend = false;

        this.wasTouchstart = true;

        var initX = event.original.touches[0].pageX,
            initY = event.original.touches[0].pageY;

        Ractive.$win.on("touchmove.hover-PageSection", function (event) {

            this.cancelTouchend = Math.abs(initX - event.originalEvent.touches[0].pageX) > 5 ||
                Math.abs(initY - event.originalEvent.touches[0].pageY) > 5;

        }.bind(this));
    },

    //předává informaci EditUI, že uživatel chce zobrazit UI
    handleTouchend: function (event) {

        Ractive.$win.off("touchmove.hover-PageSection");

        if (event.original.touches.length > 1) {

            return;
        }

        if (this.wasTouchstart && this.EditUI) {

            this.EditUI.fire("pageSectionTouchend", event, this, this.cancelTouchend);
        }

        this.wasTouchstart = false;
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
    },

    findPageElements: function () {

        var elements = [],

            components = this.findAllComponents(),
            c = components.length - 1;

        for (c; c >= 0; c--) {

            if (components[c].PAGE_ELEMENT) {

                elements.unshift(components[c]);
            }
        }

        return elements;
    },

    forEachPageElement: function (fn/*, args...*/) {

        var elements = this.findPageElements(),
            e = elements.length - 1,

            args = Array.prototype.slice.call(arguments);

        args.shift();

        for (e; e >= 0; e--) {

            if (typeof fn === "string" && elements[e][fn]) {

                elements[e][fn].apply(elements[e], args);

            } else if (typeof fn === "function") {

                fn.apply(elements[e], elements[e]);
            }
        }
    }

});
