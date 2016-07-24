/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),
            EventEmitter = require("./../../../../../../libs/EventEmitter")();

        module.exports = factory(Ractive, EventEmitter);

    } else {

        root.PageElementButtons = factory(root.Ractive);
    }

}(this, function (Ractive) {

    var instanceCounter = 0;

    return  function () {

        var id = instanceCounter++;

        if (Ractive.EDIT_MODE) {

            Ractive.$win = Ractive.$win || $(window);

            var CLASS = {
                addButton: "E_PageElementButtons--add-button"
            };

            var removeButtonListener = this.on("*.removeButton", function (event, element, button) {

                button.removing = true;

                button.$text.blur();

                var dataButtons = this.get("section.buttons"),
                    d = dataButtons.length - 1;

                for (d; d >= 0; d--) {

                    if (dataButtons[d] === element) {

                        this.splice("section.buttons", d, 1);

                        break;
                    }
                }

                this.fire("pageChange");

            }.bind(this));

            var addButtonListener = this.on("addButton", function () {

                this[this.get("reverseButtons") ? "unshift": "push"]("section.buttons", this.components.PageElementButton.prototype.getNewItem.call(this));

            }.bind(this));

            var buttonsObserver = this.observe("section.buttons", function (buttons) {

                if (this.removing) {

                    return;
                }

                this.fire("emptyButtons", !buttons || !buttons.length, "PageElementButtons");

                this.set("showAddButton", !buttons || buttons.length < (this.MAX_BUTTONS || 3));

                if ((!buttons || !buttons.length) && this.get("pageElementSettings") === "button") {

                    this.set("pageElementSettings", null);
                }
            });

            //upravit pozici přidávacího tlačítka podle velikosti okna
            var changeButtonPositionTimeout = null,

                checkButtonPosition = function () {

                    if (this.get("showAddButton")) {

                        var button = this.find("." + CLASS.addButton);

                        if (button) {

                            this.set("addButtonBottom", false);

                            var rect = button.getBoundingClientRect();

                            this.set("addButtonBottom", rect.right > document.documentElement.clientWidth - 10 || rect.left < 10);
                        }
                    }

                }.bind(this);

            var buttonsObserverDefered = this.observe("section.buttons", function () {

                if (this.removing) {

                    return;
                }

                clearTimeout(changeButtonPositionTimeout);

                changeButtonPositionTimeout = setTimeout(checkButtonPosition, 500);

            }, {defer: true});

            Ractive.$win.on("resize.PageElementButtons-" + this.EVENT_NS + id, function () {

                clearTimeout(changeButtonPositionTimeout);

                changeButtonPositionTimeout = setTimeout(checkButtonPosition, 100);
            });
        }

        return {
            teardown: function () {

                if (Ractive.EDIT_MODE) {

                    removeButtonListener.cancel();
                    addButtonListener.cancel();
                    buttonsObserver.cancel();
                    buttonsObserverDefered.cancel();

                    Ractive.$win.off(".PageElementButtons-" + this.EVENT_NS + id);

                    clearTimeout(changeButtonPositionTimeout);

                }

            }.bind(this)
        };
    };
}));
