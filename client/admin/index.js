/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var Ractive = require("ractive");

module.exports = Ractive.extend({

    template: require("./index.tpl"),

    data: function () {

        return {
            selectedPage: null,
            editPage: null
        };

    },

    onrender: function () {

        this.observe("selectedPage", function (page) {

            if (!page || page._id === this.get("pageId")) {

                return;
            }

            this.loadPage(page._id);

        }, {init: false});
    },

    loadPage: function (pageId) {

        var pageReq = this.req("page", { _id: pageId });

        pageReq.then(function (page) {

            this.set("pageId", page._id);

        }.bind(this));
    }
});
