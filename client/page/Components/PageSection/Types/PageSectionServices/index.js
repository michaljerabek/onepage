/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            PageSection = require("./../../"),

            components = {
                BasicEditUI: require("./../../PageSectionEditUI/"),

                PageElementService: require("./../../../PageElement/Types/PageElementService")
            },

            partials = {
                pageSectionContent: require("./index.tpl"),
                pageSectionSettings: require("./page-section-settings.tpl"),
                pageSectionEditUI: "<BasicEditUI section='{{.section}}' />"
            };

        module.exports = factory(Ractive, PageSection, components, partials);

    } else {

        root.PageSectionServices = factory(root.Ractive, root.PageSection);
    }

}(this, function (Ractive, PageSection, components, partials) {

    var CLASS = {
        addItem: "E_PageSectionServices--add-item"
    };

    return PageSection.extend({

        partials: partials || {},

        components: components || {},

        data: function () {

            return {
            };
        },

        onconfig: function () {

            this.superOnconfig();

            this.setDefaultValues();

        },

        oninit: function () {

            this.superOninit();

            if (Ractive.EDIT_MODE) {

                if (typeof window !== "undefined") {

                    Ractive.$win = Ractive.$win || $(window);

                    this.on("*.removeFact", function (event, element, item) {

                        item.removing = true;

                        var dataItems = this.get("section.items"),
                            d = dataItems.length - 1;

                        item.findAllComponents("PageElementText").forEach(function (element) {
                            element.$text.blur();
                        });

                        for (d; d >= 0; d--) {

                            if (dataItems[d] === element) {

                                this.splice("section.items", d, 1);

                                break;
                            }
                        }

                        this.fire("pageChange");

                    }.bind(this));

                    this.on("addItem", function () {

                        this.push("section.items", this.components.PageElementService.prototype.getNewItem.call(this));

                    }.bind(this));

                    this.observe("section.items", function (items) {

                        if (this.removing) {

                            return;
                        }

                        this.set("showAddItem", !items || items.length < 8);

                        if ((!items || !items.length) && this.get("pageElementSettings") === "service") {

                            this.set("pageElementSettings", null);
                        }
                    });

                    this.observe("section.items", function () {

                        if (this.removing) {

                            return;
                        }

                        clearTimeout(this.changeButtonPositionTimeout);

                        this.changeButtonPositionTimeout = setTimeout(this.checkButtonPosition.bind(this), 500);

                    }, {defer: true});

                    Ractive.$win.on("resize.PageSectionServices-" + this.EVENT_NS, function () {

                        clearTimeout(this.changeButtonPositionTimeout);

                        this.changeButtonPositionTimeout = setTimeout(this.checkButtonPosition.bind(this), 100);
                    }.bind(this));
                }
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

            clearTimeout(this.changeButtonPositionTimeout);

            Ractive.$win.off("resize.PageSectionServices-" + this.EVENT_NS);
        },

        setDefaultValues: function () {

        },

        //upravit pozici přidávacího tlačítka podle velikosti okna
        checkButtonPosition: function () {

            if (this.get("showAddItem")) {

                var button = this.find("." + CLASS.addItem);

                if (button) {

                    this.set("addItemBottom", false);

                    var rect = button.getBoundingClientRect();

                    this.set("addItemBottom", rect.right > document.documentElement.clientWidth - 10 || rect.left < 10);
                }
            }

        },

        getTextPaths: function () {

            var paths = PageSection.prototype.getTextPaths.apply(this);

            paths = paths.concat(["title", "subtitle"]);

            var items = this.get("section.items"),
                i = items.length - 1;

            for (i; i >= 0; i--) {

                paths.push("items." + i + ".title");
                paths.push("items." + i + ".content");
            }

            return paths;
        },

        findSectionImages: function () {

            var images = PageSection.prototype.findSectionImages.apply(this);

            if (this.get("section.layout") === "center-image") {

                var items = this.get("section.items") || [],
                    i = items.length - 1;

                for (i; i >= 0; i--) {

                    if (items[i].image && items[i].image.src) {

                        images.unshift({
                            src: items[i].image.src,
                            name: items[i].image.alt || decodeURIComponent(items[i].image.src).split("/").pop().replace(/[0-9]+-/, "")
                        });
                    }
                }
            }

            return images;
        }

    });

}));
