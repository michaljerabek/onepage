/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/
/*global ractiveData, $*/

var Ractive = require("ractive");
var config = require("./../config");
var on = require("./../helpers/on");

var ractive = function (settings) {

    return new Ractive({

        enhance: true,

        el: settings.el,

        template: require("./page.tpl"),

        components: {
            Page: require("./Page/")
        },

        partials: {

        },

        events: settings.events,

        transitions: settings.transitions,

        data: settings.data,

        onconfig: function () {
        },

        oncomplete: function () {

            var ractive = this;

            $("body").on("click", "a[href^='#section-']", function (e) {

                if (ractive.findComponent("Page").get("editMode") && !e.ctrlKey) {

                    return true;
                }

                window.location.hash = "";

                var sectionInternalId = this.href.split("#")[1],
                    sectionId = $("[data-page-section-internal-id='" + sectionInternalId + "']").attr("id");

                window.location.hash = "#" + sectionId;

                e.preventDefault();
                return false;
            });

        }
    });

};

if (on.client) {

    ractive = require("./initApp")(ractive, ractiveData, config);

    ractiveData = null;
}

module.exports = ractive;

