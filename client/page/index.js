/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

var on = require("./../../helpers/on");
var CLASS = require("./CLASSNAMES");
var EventEmitter = require("./../libs/EventEmitter")();

var Ractive = require("ractive");

module.exports = Ractive.extend({

    template: require("./index.tpl"),

    components: {
        PageSection: require("./Components/PageSection"),
        NewPageSectionSelector: require("./Components/NewPageSectionSelector"),
        GlobalPageSettings: require("./Components/GlobalPageSettings")
    },

    onrender: function () {
    },

    oncomplete: function () {

        if (this.get("editMode") && !this.get("isAdmin")) {

            this.initPage();
        }


        if (!this.get("editMode") && !this.get("isAdmin")) {

            this.initScrollToSection();
        }
    },

    onteardown: function () {

        if (this.get("editMode")) {

            this.contentEditor.destroy();
            this.titleEditor.destroy();

            this.pageSectionsManager.destroy();

            this.scrollToSection.destroy();
        }
    },

    onconfig: function () {

        if (this.get("isAdmin")) {

            this.Admin = this.root.findComponent("Admin");

            var pageId = this.get("pageId");

            if (this.isCurrentPage(pageId)) {

                return;
            }

            this.loadPage(pageId);
        }
    },

    initEditors: function () {

        var TitleEditor = require("./Editor/TitleEditor");
        var ContentEditor = require("./Editor/ContentEditor");

        this.titleEditor = new TitleEditor(this.get.bind(this, "page.sections"));
        this.contentEditor = new ContentEditor(this.get.bind(this, "page.sections"));

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

    findAllPageSections: function () {

        return this.findAllComponents("PageSection");
    }

});
