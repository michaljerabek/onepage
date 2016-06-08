/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageElement = require("./../../"),
            Ractive = require("ractive"),

            U = require("./../../../../../libs/U"),
            on = require("./../../../../../../helpers/on"),

            partials = {
                pageElementEditUI: require("./edit-ui.tpl"),
                pageElementContent: require("./index.tpl")
            };

        module.exports = factory(
            PageElement,
            Ractive,
            U,
            partials,
            on
        );

    } else {

        root.PageElementTitle = factory(
            root.PageElement,
            root.Ractive,
            root.U,
            {},
            {client: true}
        );
    }

}(this, function (PageElement, Ractive, U, partials, on) {

    return PageElement.extend({

        components: {
        },

        partials: partials,

        data: function () {

            return {
                type: "title",
                hasEditUI: true
            };
        },

        onconfig: function () {

            this.superOnconfig();

            if (Ractive.EDIT_MODE) {

                this.on("stateChange", function (state) {

                    if (state && (this.hasFocusedEditor() || this.focusin)) {

                        this.set("state", "active");

                    } else {

                        this.set("state", "inactive");
                    }
                });

                this.on("activate", function (event) {

                    event.original.preventDefault();

                    setTimeout(function() {

                        var editable = this.find("[data-medium-editor-element='true']");

                        if (editable) {

                            editable.focus();

                            this.fire("stateChange", this.get("showOutline"));
                        }

                    }.bind(this), 0);
                });
            }

        },

        onrender: function () {

            this.superOnrender();
        },

        oncomplete: function () {

            this.superOncomplete();
        },

        onteardown: function () {

            this.superOnteardown();
        },

        isEmpty: function () {

            return (this.get("element.title." + this.get("lang")) || "").replace(/(?:<[^>]*>)/g, "").match(/^(\s|\&nbsp\;)*$/);
        }

    });

}));

