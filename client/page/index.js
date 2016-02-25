var Ractive = require("ractive");

module.exports = Ractive.extend({
    template: require("./index.tpl"),

    onrender: function () {
    },

    onconfig: function () {

        if (this.get("isAdmin")) {

            this.Admin = this.root.findComponent("Admin");

            var pageId = this.get("pageId");

            if (pageId === this.root.get("page._id")) {

                return;
            }

            this.loadPage(pageId);
        }
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
