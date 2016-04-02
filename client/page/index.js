/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

var on = require("./../../helpers/on");
var EventEmitter = require("./../libs/EventEmitter")();

var Ractive = require("ractive");

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
        contentEditor: "E_Editor__content"
    },

    components: {
        PageSection: require("./Components/PageSection"),

        PageSectionA: require("./Components/PageSection/Types/PageSectionA"),
        PageSectionB: require("./Components/PageSection/Types/PageSectionB"),
        PageSectionC: require("./Components/PageSection/Types/PageSectionC"),

        NewPageSectionSelector: Ractive.EDIT_MODE ? require("./Components/NewPageSectionSelector") : null,
        GlobalPageSettings: Ractive.EDIT_MODE ? require("./Components/GlobalPageSettings") : null
    },

    partials: {
        PageSectionA: "<PageSectionA section='{{this}}' />",
        PageSectionB: "<PageSectionB section='{{this}}' />",
        PageSectionC: "<PageSectionC section='{{this}}' />"
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

        mode = this.get("editMode") ? ScrollToSection.MODES.EDIT : ScrollToSection.MODES.PAGE;

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
    },

    loadPage: function (pageId) {

        var loadReq = this.req("page", { _id: pageId });

        loadReq.then(function (page) {

            this.root.set("page.name", page.name);
            this.root.set("page.settings", page.settings);
            this.root.set("page.sections", page.sections);
            this.root.set("page._id", page._id);

        }.bind(this));

        loadReq.then(this.initPage.bind(this));
    },

    savePage: function () {

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
                console.log("Uloženo!");
            }
        }.bind(this));
    },

    closePage: function () {

        this.Admin.set("editPage", null);
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
    }

});
