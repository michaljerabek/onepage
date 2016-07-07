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

var ANIMATIONS = require("./PAGE_SETTINGS/ANIMATIONS");

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

    ANIMATIONS: ANIMATIONS,

    components: {
        PageSection: require("./Components/PageSection"),

        PageSectionHeader: require("./Components/PageSection/Types/PageSectionHeader"),
        PageSectionA: require("./Components/PageSection/Types/PageSectionA"),
        PageSectionB: require("./Components/PageSection/Types/PageSectionB"),
        PageSectionC: require("./Components/PageSection/Types/PageSectionC"),

        NewPageSectionSelector: Ractive.EDIT_MODE ? require("./Components/NewPageSectionSelector") : null,
        GlobalPageSettings: Ractive.EDIT_MODE ? require("./Components/GlobalPageSettings") : null,

        InlineWidget: Ractive.EDIT_MODE ? require("./../libs/Components/InlineWidget") : null,
        PageMenuInlineWidget: Ractive.EDIT_MODE ? require("./PageMenu/Components/PageMenuInlineWidget") : null
    },

    partials: {
        PageSectionHeader: "<PageSectionHeader section='{{this}}' sections='{{~/page.sections}}' lang='{{~/page.lang}}' tplLang='{{~/page.tplLang}}' />",
        PageSectionA: "<PageSectionA section='{{this}}' lang='{{~/page.lang}}' tplLang='{{~/page.tplLang}}' />",
        PageSectionB: "<PageSectionB section='{{this}}' lang='{{~/page.lang}}' tplLang='{{~/page.tplLang}}' />",
        PageSectionC: "<PageSectionC section='{{this}}' lang='{{~/page.lang}}' tplLang='{{~/page.tplLang}}' />",

        pageMenu: Ractive.EDIT_MODE ? require("./PageMenu/index.tpl") : null,

        Button     : Ractive.EDIT_MODE ? require("./../libs/Components/UI/Button/index.tpl")      : null,
        Switch     : Ractive.EDIT_MODE ? require("./../libs/Components/UI/Switch/index.tpl")      : null,
        Slider     : Ractive.EDIT_MODE ? require("./../libs/Components/UI/Slider/index.tpl")      : null,
        Select     : Ractive.EDIT_MODE ? require("./../libs/Components/UI/Select/index.tpl")      : null,
        Toggle     : Ractive.EDIT_MODE ? require("./../libs/Components/UI/Toggle/index.tpl")      : null,
        Text       : Ractive.EDIT_MODE ? require("./../libs/Components/UI/Text/index.tpl")        : null,
        FlatButton : Ractive.EDIT_MODE ? require("./Components/UI/FlatButton/index.tpl")          : null,
        ToggleField: Ractive.EDIT_MODE ? require("./../libs/Components/UI/ToggleField/index.tpl") : null
    },

    data: function () {

        return {
            sortableActive: "",
            draggableActive: "",
            openPageMenu: null,
            cancelAddSection: false,
            unsavedChanges: false,
            loaded: false,

            defaults: {
                settings: {
                    animations: 20,
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

    onconstruct: function () {

        Ractive.defaults.Page = this;
    },

    onconfig: function () {

        if (this.get("isAdmin")) {

            if (!this.root.get("unsavedPages")) {

                this.root.set("unsavedPages", []);
            }

            this.Admin = this.root.findComponent("Admin");

            var pageId = this.get("pageId");

            if (this.isCurrentPage(pageId)) {

                this.alreadyLoaded = true;

                this.checkUnsavedChanges(pageId);

                return;
            }

            this.loadPage(pageId);

        } else {

            var page = this.get("page");

            this.changeLang(page.lang, page);
        }

        this.on("*.changeCurrentLang changeCurrentLang", this.changeLang.bind(this));

        if (Ractive.EDIT_MODE) {

            this.on("loadFiles *.loadFiles", this.loadFiles);

            this.on("fileUploaded *.fileUploaded", function (fileData) {

                if (fileData && fileData.path) {

                    if (this.get("page.files")) {

                        return this.unshift("page.files", fileData);
                    }

                    this.set("page.files", [fileData]);
                }

            }.bind(this));
        }
    },

    loadFiles: function (cb) {

        if (this.fileReq) {

            this.fileReq.then(cb);

            return;
        }

        this.fileReq = this.req("files");

        this.fileReq
            .then(function (res) {

            if (res && !res.error && res.files) {

                this.set("page.files", res.files);
            }

        }.bind(this))
            .then(cb)
            .catch(function () {});
    },

    changeLang: function (lang, page) {

        //první argument je objekt události
        if (typeof lang !== "string") {

            lang = page;
            page = arguments[2];
        }

        page = page || this.get("page");

        lang = page.settings.lang.langs[lang] ? lang : page.settings.lang.defaultLang || Object.keys(page.settings.lang.langs)[0] || "cs";

        var tplLang = page.settings.lang.langs[lang] ? page.settings.lang.langs[lang].template : "cs",

            langPromise = this.root.set("page.lang", lang);

        this.root.set("page.tplLang", tplLang);

        if (this.scrollToSection) {

            EventEmitter.trigger("langChanged.Page", [lang, Ractive.EDIT_MODE, langPromise]);

            this.scrollToSection.refresh();
        }

        return langPromise;
    },

    onrender: function () {

        if (this.Admin) {

            var $el = $("#pageWrapper");

            $el.css("margin-top", -$el.offset().top);
        }
        
        Ractive.$win = Ractive.$win || $(window);
        
        if (Ractive.EDIT_MODE) {

            //zablokovat funkci zpět při backspacu
            Ractive.$win.on("keydown.Page", function (e) {
                    
                if (e.which === 8) /*Backspace*/ {
                    
                    if (e.target && e.target.tagName.toLowerCase().match(/body|html/)) {
                        
                        return false;
                    }
                }
            });
        }

        if (Ractive.EDIT_MODE && (!this.Admin || this.alreadyLoaded)) {

            this.initPage();
        }

        if (!Ractive.EDIT_MODE && !this.Admin) {

            this.initScrollToSection();

            if (on.client) {

                this.loadedTimeout = setTimeout(this.set.bind(this, "loaded", true), 0);
            }
        }

        console.timeEnd("pageLoaded");
    },

    oncomplete: function () {

    },

    onteardown: function () {

        if (Ractive.EDIT_MODE) {

            if (this.fileReq) {

                this.fileReq.cancelReq();

                this.fileReq = null;
            }

            Ractive.$win.off(".Page");
            
            this.contentEditor.destroy();
            this.titleEditor.destroy();

            this.pageSectionsManager.destroy();

            this.scrollToSection.destroy();

            this.pageMenu.destroy();

            clearTimeout(this.loadedTimeout);
            clearTimeout(this.unsavedChangesTimeout);
        }
    },

    checkUnsavedChanges: function (pageId) {

        if (~this.root.get("unsavedPages").indexOf(pageId)) {

            this.set("unsavedChanges", true);
        }
    },

    initEditors: function () {

        var TitleEditor = require("./Editor/TitleEditor");
        var ContentEditor = require("./Editor/ContentEditor");

        this.titleEditor = new TitleEditor(
            "." + this.CLASS.titleEditor,
            this.get.bind(this, "page.sections"),
            this.get.bind(this, "page.lang")
        );
        this.contentEditor = new ContentEditor(
            "." + this.CLASS.contentEditor,
            this.get.bind(this, "page.sections"),
            this.get.bind(this, "page.lang")
        );

        this.off("sectionInserted.complete").on("sectionInserted.complete", this.refreshEditors.bind(this, true));
        this.off("sectionRemoved.complete").on("sectionRemoved.complete", this.refreshEditors.bind(this, true));

        this.editorsLoaded = true;
    },

    initScrollToSection: function () {

        var ScrollToSection = require("./ScrollToSection"),

            mode = Ractive.EDIT_MODE ? ScrollToSection.MODES.EDIT : ScrollToSection.MODES.PAGE;

        this.scrollToSection = new ScrollToSection(mode, "__section-");

        this.observe("page.settings.animations", function (value) {

            value = value || Object.keys(this.ANIMATIONS)[1];

            this.scrollToSection.setAnimation(this.ANIMATIONS[value].SCROLL.easing, this.ANIMATIONS[value].SCROLL.duration);
        });
    },

    refreshEditors: function (elementsOnly) {

        this.titleEditor.refresh(elementsOnly === true);
        this.contentEditor.refresh(elementsOnly === true);
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
        this.on("*.pageChange *.sectionOrderChanged *.elementOrderChanged", this.handlePageChanged.bind(this), {init: false});
        this.on("savePage", this.handleSavePage);
        this.on("closePage", this.handleClosePage);

        if (on.client) {

            this.loadedTimeout = setTimeout(this.set.bind(this, "loaded", true), 0);
        }
    },

    handlePageChanged: function () {

        clearTimeout(this.unsavedChangesTimeout);

        if (this.get("pageIsSaving") || this.saving) {

            return;
        }

        this.unsavedChangesTimeout = setTimeout(
            this.set.bind(this, "unsavedChanges", true), 500
        );
    },

    loadPage: function (pageId) {

        var loadReq = this.req("page", {
            _id: pageId
        });

        loadReq.then(function (page) {

            var lang = page.settings.lang.defaultLang || Object.keys(page.settings.lang.langs)[0] || "cs",

                tplLang = page.settings.lang.langs[lang] ? page.settings.lang.langs[lang].template : "cs";

            this.root.set("page.name", page.name);
            this.root.set("page.settings", page.settings);
            this.root.set("page.sections", page.sections);
            this.root.set("page._id", page._id);
            this.root.set("page.lang", lang);
            this.root.set("page.tplLang", tplLang);

        }.bind(this));

        loadReq.then(this.initPage.bind(this));
    },

    handleSavePage: function (skipDialog) {

        clearTimeout(this.changesSavedTimeout);

        if (skipDialog !== true) {

            this.fire("showDialog", {
                type: "warn",
                title: "Uložit změny",
                text: "Chcete uložit a publikovat provedené změny?",
                confirm: {
                    text: "Uložit",
                    exec: this.handleSavePage.bind(this, true)
                },
                dismiss: {
                    active: 1
                }
            });

            return;
        }

        this.set("changesSaved", false);
        this.set("pageIsSaving", true);

        this.saving = true;

        EventEmitter.trigger("saving.Page", [this]);

        EventEmitter.trigger("saving:lang:start.Page", [this]);

        this.copyLangsOnSave(this.savePage);
    },

    copyLangsOnSave: function (cb, currentLang, langs) {

        currentLang = currentLang || this.get("page.lang");

        langs = langs || Object.keys(this.get("page.settings.lang.langs"));

        var lang = langs.pop();

        while (lang) {

            this.changeLang(lang);

            lang = langs.pop();
        }

        this.changeLang(currentLang);

        EventEmitter.trigger("saving:lang:end.Page", [this]);

        cb.call(this);
//
//        this.changeLang(langs.pop()).then(function () {
//
//            if (!langs.length) {
//
//                this.changeLang(currentLang);
//
//                EventEmitter.trigger("saving:lang:end.Page", [this]);
//
//                cb.call(this);
//
//                return;
//            }
//
//            this.copyLangsOnSave(cb, currentLang, langs);
//
//        }.bind(this));
    },

    savePage: function () {

        var sortedSections = this.pageSectionsManager.getSectionsSortedByIndex(),

            params = {
                name: this.get("page.name"),
                settings: this.get("page.settings"),
                sections: sortedSections,
                _id: this.get("page._id")
            };

        this.skipRegenerateId = true;

        this.merge("page.sections", sortedSections);

        this.skipRegenerateId = false;

        var saveReq = this.req("page.save", params);

        saveReq.then(function (res) {

            if (res.saved) {

                this.set("pageIsSaving", false);
                this.set("unsavedChanges", false);
                this.set("changesSaved", true);

                var pageId = this.get("pageId"),

                    inUnsavedPages = (this.root.get("unsavedPages") || []).indexOf(pageId);

                if (~inUnsavedPages) {

                    this.root.splice("unsavedPages", inUnsavedPages, 1);
                }

                clearTimeout(this.changesSavedTimeout);

                this.changesSavedTimeout = setTimeout(this.set.bind(this, "changesSaved", false), 3000);

                this.saving = false;

                EventEmitter.trigger("saved.Page", [this]);

                console.log("Uloženo!");
            }
        }.bind(this));
    },

    handleClosePage: function () {

        if (this.get("unsavedChanges")) {

            this.fire("showDialog", {
                title: "Zavřít editaci",
                text: "Některé změny nebyly uloženy. Chcete přesto eidtaci zavřít?",
                type: "warn",
                confirm: {
                    exec: function () {

                        if (this.Admin) {

                            if (this.get("unsavedChanges")) {

                                this.merge("page.sections", this.pageSectionsManager.getSectionsSortedByIndex());

                                if (!~(this.root.get("unsavedPages") || []).indexOf(this.get("pageId"))) {

                                    this.root.push("unsavedPages", this.get("pageId"));
                                }
                            }

                            this.Admin.set("editPage", null);
                        }
                    },
                    context: this,
                    text: "Ano"
                },
                dismiss: {
                    text: "Ne"
                }
            });

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
    },

    findSectionsBgImages: function () {

        var images = [],

            lang = this.get("page.lang");

        this.forEachPageSection(function (pageSection) {

            var src = pageSection.get("section.backgroundImage.src");

            if (src && src !== "none") {

                images.unshift({
                    src: src,
                    name: pageSection.get("section.name." + lang)
                });
            }
        });

        return images;
    }
});
