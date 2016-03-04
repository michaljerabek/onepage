/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

var Ractive = require("ractive");

module.exports = Ractive.extend({

    template: require("./index.tpl"),

    components: {
        PageSection: require("./Components/PageSection"),
        NewPageSectionSelector: require("./PageSectionsManager/Components/NewPageSectionSelector")
    },

    onrender: function () {

    },

    oncomplete: function () {

        if (this.get("editMode")) {

            var PageSectionBuilder = require("./PageSectionBuilder");

            this.pageSectionsManager = require("./PageSectionsManager")(
                this, new PageSectionBuilder(this), !this.get("page._id")
            );
        }
    },

    onteardown: function () {
        this.pageSectionsManager.destroy();
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

    isCurrentPage: function (pageId) {

        return pageId === this.root.get("page._id");
    },

    loadPage: function (pageId) {

        var loadReq = this.req("page", { _id: pageId });

        loadReq.then(function (page) {

            this.root.set("page.name", page.name);
            this.root.set("page.sections", page.sections);
            this.root.set("page._id", page._id);

        }.bind(this));

        loadReq.then(function () {

            this.pageSectionsManager.reset();

        }.bind(this));
    },

    savePage: function () {

        this.set("pageIsSaving", true);

        var params = {
            name: this.get("page.name"),
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
