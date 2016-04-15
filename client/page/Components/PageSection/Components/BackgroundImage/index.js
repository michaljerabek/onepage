/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var on = require("./../../../../../../helpers/on");
        var EventEmitter = require("./../../../../../libs/EventEmitter")();

        var Ractive = require("ractive"),

            Parallax = require("./Parallax"),

            template = require("./index.tpl");

        module.exports = factory(Ractive, Parallax, template, on);

    } else {

        root.BackgroundImage = factory(root.Ractive, root.Parallax, null, {client: true});
    }

}(this, function (Ractive, Parallax, template, on) {

    return Ractive.extend({

        template: template || "",

        CLASS: {
            self: "P_BackgroundImage",

            image: "P_BackgroundImage--image",

            parallax: "P_BackgroundImage__parallax",
            fixed: "P_BackgroundImage__fixed"
        },

        components: {
        },

        partials: {
        },

        data: function () {

            return {
                editMode: Ractive.EDIT_MODE,
                data: {
                    backgroundImage: "",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",

                    parallax: false
                }
            };
        },

        onrender: function () {

            if (on.client) {

                this.PageSection = this.getPageSection();

                this.initParallax();
            }
        },

        initParallax: function () {

            this.observe("data.parallax", function () {

                if (this.PageSection.get("isRemoved")) {

                    clearTimeout(this.sectionChangeThrottle);

                    if (this.parallax) {

                        this.parallax.destroy();

                        this.parallax = null;
                    }

                    return;
                }

                if (this.get("data.parallax")) {

                    if (this.parallax) {

                        return this.parallax.refresh();
                    }

                    this.parallax = new Parallax(this);

                    return;
                }

                if (!this.get("data.parallax") && this.parallax) {

                    this.parallax.destroy();
                }

            }, {defer: true});

            this.PageSection.observe("section", this.handleSectionChange.bind(this), {init: false, defer: true});
            this.PageSection.on("sectionOrderChanged", this.handleSectionChange.bind(this), {init: false, defer: true});
        },

        onteardown: function () {

            clearTimeout(this.sectionChangeThrottle);

            if (this.parallax) {

                this.parallax.destroy();

                this.parallax = null;
            }
        },

        handleSectionChange: function () {

            clearTimeout(this.sectionChangeThrottle);

            this.sectionChangeThrottle = setTimeout(function() {

                if (this.parallax && this.get("data.parallax")) {

                    this.parallax.refresh();
                }
            }.bind(this), 350);
        }
    });

}));
