/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

var Ractive = require("ractive");

module.exports = Ractive.extend({
    template: require("./index.tpl"),

    components: {
        PageSection: require("./Components/PageSection")
    },

    onrender: function () {
    },

    onconfig: function () {

        if (this.get("isAdmin") === true) {

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

        var pageReq = this.req("/page", { _id: pageId });

        pageReq.then(function (page) {

            this.root.set("page.name", page.name);
            this.root.set("page.sections", page.sections);
            this.root.set("page._id", page._id);

        }.bind(this));
    },

    closePage: function () {
        this.Admin.set("editPage", null);
    }
});
