/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

var on = require("./../../helpers/on");
var Ractive = require("ractive");

var EventEmitter = require("./../libs/EventEmitter")();

var FixedElement;
var PageMenu;

if (on.client) {

    FixedElement = require("./../libs/FixedElement");
    PageMenu = require("./PageMenu");
}

Ractive.defaults.getPageSection = function () {

    if (this.PAGE_SECTION) {

        return this;
    }

    if (this.parent) {

        return Ractive.defaults.getPageSection.apply(this.parent, arguments);
    }

    return null;
};

module.exports = Ractive.extend({

    template: require("./index.tpl"),

    CLASS: {
        titleEditor: "E_Editor__title",
        contentEditor: "E_Editor__content",

        sortableActive: "E_Page__sortable-active",

        PageMenu: {
            self: "E_PageMenu"
        }
    },

    components: {
        PageSection: require("./Components/PageSection"),

        PageSectionA: require("./Components/PageSection/Types/PageSectionA"),
        PageSectionB: require("./Components/PageSection/Types/PageSectionB"),
        PageSectionC: require("./Components/PageSection/Types/PageSectionC"),

        NewPageSectionSelector: Ractive.EDIT_MODE ? require("./Components/NewPageSectionSelector") : null,
        GlobalPageSettings: Ractive.EDIT_MODE ? require("./Components/GlobalPageSettings") : null,

        InlineWidget: Ractive.EDIT_MODE ? require("./../libs/Components/InlineWidget") : null,
        PageMenuInlineWidget: Ractive.EDIT_MODE ? require("./PageMenu/Components/PageMenuInlineWidget") : null
    },

    partials: {
        PageSectionA: "<PageSectionA section='{{this}}' />",
        PageSectionB: "<PageSectionB section='{{this}}' />",
        PageSectionC: "<PageSectionC section='{{this}}' />",

        pageMenu: Ractive.EDIT_MODE ? require("./PageMenu/index.tpl") : null,

        FlatButton: Ractive.EDIT_MODE ? require("./Components/UI/FlatButton/index.tpl") : null,
        Button: Ractive.EDIT_MODE ? require("./../libs/Components/UI/Button/index.tpl") : null,
        Switch: Ractive.EDIT_MODE ? require("./../libs/Components/UI/Switch/index.tpl") : null,
        Slider: Ractive.EDIT_MODE ? require("./../libs/Components/UI/Slider/index.tpl") : null,
        Select: Ractive.EDIT_MODE ? require("./../libs/Components/UI/Select/index.tpl") : null,
        Toggle: Ractive.EDIT_MODE ? require("./../libs/Components/UI/Toggle/index.tpl") : null,
        ToggleField: Ractive.EDIT_MODE ? require("./../libs/Components/UI/ToggleField/index.tpl") : null
    },

    data: function () {

        return {
            sortableActive: "",
            draggableActive: "",
            openPageMenu: null,
            cancelAddSection: false,
            unsavedChanges: false,

            defaults: {
                settings: {
                    animations: 10,
                    roundness: 0,
                    fontType: "P_font-type-1",
                    colorPalette: {
                        colors: [
                            "rgb(255, 200, 87)",
                            "rgb(233, 114, 76)",
                            "rgb(197, 40, 61)",
                            "rgb(72, 29, 36)",
                            "rgb(37, 95, 133)"
                        ],
                        headerImg: ""
                    }
                }
            }
        };
    },

    onconfig: function () {

        if (this.get("isAdmin")) {

            this.Admin = this.root.findComponent("Admin");

            var pageId = this.get("pageId");

            if (this.isCurrentPage(pageId)) {

                this.alreadyLoaded = true;

                return;
            }

            this.loadPage(pageId);
        }
    },

    onrender: function () {

        if (this.Admin) {

            var $el = $("#pageWrapper");

            $el.css("margin-top", -$el.offset().top);
        }
    },

    oncomplete: function () {

        if (Ractive.EDIT_MODE && (!this.Admin || this.alreadyLoaded)) {

            this.initPage();
        }

        if (!Ractive.EDIT_MODE && !this.Admin) {

            this.initScrollToSection();
        }

        console.timeEnd("pageLoaded");
    },

    onteardown: function () {

        if (Ractive.EDIT_MODE) {

            this.contentEditor.destroy();
            this.titleEditor.destroy();

            this.pageSectionsManager.destroy();

            this.scrollToSection.destroy();

            this.pageMenu.destroy();

            clearTimeout(this.unsavedChangesTimeout);
        }
    },

    initEditors: function () {

        var TitleEditor = require("./Editor/TitleEditor");
        var ContentEditor = require("./Editor/ContentEditor");

        this.titleEditor = new TitleEditor(
            "." + this.CLASS.titleEditor,
            this.get.bind(this, "page.sections")
        );
        this.contentEditor = new ContentEditor(
            "." + this.CLASS.contentEditor,
            this.get.bind(this, "page.sections")
        );

        this.off("sectionInserted.complete").on("sectionInserted.complete", this.refreshEditors);

        this.editorsLoaded = true;
    },

    initScrollToSection: function () {

        var ScrollToSection = require("./ScrollToSection"),

            mode = Ractive.EDIT_MODE ? ScrollToSection.MODES.EDIT : ScrollToSection.MODES.PAGE;

        this.scrollToSection = new ScrollToSection(mode, "section-");
    },

    refreshEditors: function () {

        this.titleEditor.refresh();
        this.contentEditor.refresh();
    },

    isCurrentPage: function (pageId) {

        return pageId === this.root.get("page._id");
    },

    initPage: function () {

        if (!this.pageSectionsManager) {

            var PageSectionBuilder = require("./PageSectionBuilder");

            this.pageSectionBuilder = new PageSectionBuilder(this);

            this.pageSectionsManager = require("./PageSectionsManager")(
                this, this.pageSectionBuilder, !this.get("page._id")
            );

        } else {

            this.pageSectionsManager.reset();
        }

        this[this.editorsLoaded ? "refreshEditors" : "initEditors"]();

        if (!this.scrollToSection) {

            this.initScrollToSection();
        }

        this.pageMenuElements = this.findAll("." + this.CLASS.PageMenu.self);

        if (!this.pageMenu) {

            this.pageMenu = new PageMenu(this.pageMenuElements, this);

        } else {

            this.pageMenu.reset();
        }

        if (!this.defaultColorsGenerator) {

            if (!this.get("page.settings.colorPalette")) {

                this.set("page.settings.colorPalette", this.get("defaults.settings.colorPalette"));
            }

            var DefaultColorsGenerator = require("./DefaultColorsGenerator");

            this.defaultColorsGenerator = new DefaultColorsGenerator(this, this.get("page.settings.colorPalette"));

        } else {

            this.defaultColorsGenerator.reset();
        }

        //sledovat změny stránky -> označit jako neuložené
        this.observe("page.settings page.sections", this.handlePageChanged, {init: false});
        this.on("*.sectionOrderChanged", this.handlePageChanged, {init: false});
        this.on("savePage", this.savePage);
        this.on("closePage", this.closePage);
    },

    handlePageChanged: function () {

        clearTimeout(this.unsavedChangesTimeout);

        this.unsavedChangesTimeout = setTimeout(
            this.set.bind(this, "unsavedChanges", true), 500
        );
    },

    loadPage: function (pageId) {

        var loadReq = this.req("page", {
            _id: pageId
        });

        loadReq.then(function (page) {

            this.root.set("page.name", page.name);
            this.root.set("page.settings", page.settings);
            this.root.set("page.sections", page.sections);
            this.root.set("page._id", page._id);

        }.bind(this));

        loadReq.then(this.initPage.bind(this));
    },

    savePage: function () {

        clearTimeout(this.changesSavedTimeout);

        this.set("changesSaved", false);
        this.set("pageIsSaving", true);

        var params = {
            name: this.get("page.name"),
            settings: this.get("page.settings"),
            sections: this.pageSectionsManager.getSectionsSortedByIndex(),
            _id: this.get("page._id")
        };

        var saveReq = this.req("page.save", params);

        saveReq.then(function (res) {

            if (res.saved) {

                this.set("pageIsSaving", false);
                this.set("unsavedChanges", false);
                this.set("changesSaved", true);

                clearTimeout(this.changesSavedTimeout);

                this.changesSavedTimeout = setTimeout(this.set.bind(this, "changesSaved", false), 3000);

                console.log("Uloženo!");
            }
        }.bind(this));
    },

    closePage: function () {

        if (this.get("unsavedChanges") && !confirm("Neuložené změny. Přesto zavřít?")) {

            return;
        }

        if (this.Admin) {

            this.Admin.set("editPage", null);
        }
    },

    getPageElement: function () {

        this.self = this.self || this.find("#page");

        return this.self;
    },

    get$PageElement: function () {

        this.$self = this.$self || $(this.self);

        return this.$self;
    },

    findSiblingSections: function (section) {

        var allSections = this.findAllPageSections(),
            s = allSections.length - 1,

            siblings = [];

        for (s; s >= 0; s--) {

            if (allSections[s] !== section) {

                siblings.unshift(allSections[s]);
            }
        }

        return siblings;
    },

    findAllPageSections: function () {

        var components = this.findAllComponents(),
            c = components.length - 1,

            pageSections = [];

        for (c; c >= 0; c--) {

            if (components[c].PAGE_SECTION) {

                pageSections.unshift(components[c]);
            }
        }

        return pageSections;
    },

    findPageSections: function () {

        return this.findAllPageSections();
    },

    getPageSectionByElement: function (element) {

        element = element.jquery ? element[0]: element;

        var pageSection = null;

        this.forEachPageSection(function () {

            if (this.getSectionElement() === element) {

                pageSection = this;

                return false;
            }
        });

        return pageSection;
    },

    forEachPageSection: function (/*fn, args...*/) {

        var args = Array.prototype.slice.call(arguments),

            sections = $.isArray(args[0]) ? args.shift() : this.findPageSections(),
            s = sections.length - 1,

            fn = args.shift();

        for (s; s >= 0; s--) {

            if (typeof fn === "string" && sections[s][fn]) {

                sections[s][fn].apply(sections[s], args);

            } else if (typeof fn === "function") {

                var returnValue = fn.call(sections[s], sections[s]);

                if (returnValue === false) {

                    break;
                }
            }
        }
    },

    forEachPageSectionByIndex: function (/*fn, args...*/) {

        var args = Array.prototype.slice.call(arguments);

        args.unshift(this.pageSectionsManager.getSectionsSortedByIndex(true));

        this.forEachPageSection.apply(this, args);
    },

    forEachEditor: function (fn/*, args*/) {

        var editors = ["titleEditor", "contentEditor"],
            e = editors.length - 1,

            args = Array.prototype.slice.call(arguments);

        args.shift();

        for (e; e >= 0; e--) {

            if (typeof fn === "string" && this[editors[e]].editor && this[editors[e]].editor[fn]) {

                this[editors[e]].editor[fn].apply(this[editors[e]].editor, args);

            } else if (typeof fn === "function" && this[editors[e]].editor) {

                var returnValue = fn.call(this[editors[e]].editor, this[editors[e]].editor);

                if (returnValue === false) {

                    break;
                }
            }
        }
    },

    findMostUsedColors: function (maxCount) {

        var colorUsed = {};

        this.forEachPageSection(function (pageSection) {

            var colors = pageSection.getColors(),

                c = colors.length - 1,
                colorTemp;

            for (c; c >= 0; c--) {

                colorTemp = colors[c].replace(" ", "");

                colorUsed[colorTemp] = colorUsed[colorTemp] ? colorUsed[colorTemp] + 1: 1;
            }
        });

        return Object.keys(colorUsed).sort(function (a, b) {

            return colorUsed[b] - colorUsed[a];

        }).splice(0, maxCount || 5);
    }

});
