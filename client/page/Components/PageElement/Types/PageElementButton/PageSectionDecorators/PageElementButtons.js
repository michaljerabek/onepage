/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive");

        module.exports = factory(Ractive);

    } else {

        root.PageElementButtons = factory(root.Ractive);
    }

}(this, function (Ractive) {

    return  function () {

        if (Ractive.EDIT_MODE) {

            Ractive.$win = Ractive.$win || $(window);

            var CLASS = {
                addButton: "E_PageElementButtons--add-button"
            };

            this.on("*.removeButton", function (event, element, button) {

                button.removing = true;

                var buttons = this.findAllComponents("PageElementButton"),
                    b = buttons.length - 1;

                for (b; b >= 0; b--) {

                    buttons[b].cancelObservers();
                }

                var dataButtons = this.get("section.buttons"),
                    d = dataButtons.length - 1;

                for (d; d >= 0; d--) {

                    if (dataButtons[d] === element) {

                        this.splice("section.buttons", d, 1);
                    }
                }

                buttons = this.findAllComponents("PageElementButton");
                b = buttons.length - 1;

                for (b; b >= 0; b--) {

                    buttons[b].initObservers();
                }

            }.bind(this));

            this.on("addButton", function () {

                this.push("section.buttons", this.components.PageElementButton.prototype.getNewItem.call(this));

            }.bind(this));

            this.observe("section.buttons", function (buttons) {

                this.set("showAddButton", !buttons || buttons.length < (this.MAX_BUTTONS || 3));
            });

            //upravit pozici přidávacího tlačítka podle velikosti okna
            var changeButtonPositionTimeout = null,

                checkButtonPosition = function () {

                    if (this.get("showAddButton")) {

                        var button = this.find("." + CLASS.addButton);

                        if (button) {

                            this.set("addButtonBottom", false);

                            var rect = button.getBoundingClientRect();

                            this.set("addButtonBottom", rect.right > document.documentElement.clientWidth - 10);
                        }
                    }

                }.bind(this);

            this.observe("section.buttons", function () {

                clearTimeout(changeButtonPositionTimeout);

                changeButtonPositionTimeout = setTimeout(checkButtonPosition, 500);

            }, {defer: true});

            Ractive.$win.on("resize.PageElementButtons-" + this.EVENT_NS, function () {

                clearTimeout(changeButtonPositionTimeout);

                changeButtonPositionTimeout = setTimeout(checkButtonPosition, 100);
            });
        }

        return {
            teardown: function () {

                if (Ractive.EDIT_MODE) {

                    Ractive.$win.off(".PageElementButtons-" + this.EVENT_NS);

                    clearTimeout(changeButtonPositionTimeout);

                    this.off("*.removeButton");
                    this.off("addButton");
                }

            }.bind(this)
        };
    };
}));
