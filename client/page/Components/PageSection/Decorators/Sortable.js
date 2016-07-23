/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive");
        var EventEmitter = require("./../../../../libs/EventEmitter")();

        module.exports = factory(Ractive, EventEmitter);

    } else {

        root.Sortable = factory(root.Ractive, root.EventEmitter);
    }

}(this, function (Ractive, EventEmitter) {

    /**
     * Dekorátor pro přeřazování PageElementů. Použije se na rodičovský element položek.
     *
     * componentName - název přeřazovaných PageElementů ("PageElementButton", ...)
     * elementType - typ PageElementů ("button", "title", ...)
     */

    var counter = 0;

    return function (node, path, componentName, elementType) {

        var id = counter++;

        Ractive.$body = Ractive.$body || $("body");

        var CLASS = {
            item: "P_PageElement__" + elementType,
            sortHandle: "E_PageElementEditUI--sort" ,

            cursorGrabbing: "cursor-grabbing",

            active: "E_Sortable__active"
        };

        this[elementType + "SortableWrapper" + id] = node;
        this["$" + elementType + "SortableWrapper" + id] = $(node);

        var $sortableWrapper = this["$" + elementType + "SortableWrapper" + id];

        $sortableWrapper.sortable({
            forcePlaceholderSize: true,
            handle: "." + CLASS.sortHandle,
            items: "." + CLASS.item,
            keepDir: true,
            activeClass: CLASS.active
        });

        var $placeholder,
            initIndex;

        $sortableWrapper.on("sortable:update", function (e, ui) {

            //neoznamovat změnu pořadí, pokud byl element odstraněn
            //změna se projeví v příslušném poli
            if (ui.index === -1) {

                return;
            }

            this.fire("elementOrderChanged");

        }.bind(this));

        $sortableWrapper.on("sortable:activate", function (e, ui) {

            if ($placeholder) {

                $placeholder.css("position", "");
            }

            ui.item.css({
                position: "absolute",
                top: 0,
                left: 0
            });

        }.bind(this));

        $sortableWrapper.on("sortable:start", function (e, ui) {

            Ractive.$body.addClass(CLASS.cursorGrabbing);

            initIndex = ui.item.index() - 1;

        }.bind(this));

        $sortableWrapper.on("sortable:beforeStop", function (e, ui) {

            $placeholder = $sortableWrapper.find("[id*='__ph']").css("position", "absolute");

            ui.item.css({
                position: "",
                top: "",
                left: ""
            });

            Ractive.$body.removeClass(CLASS.cursorGrabbing);

        }.bind(this));

        $sortableWrapper.on("sortable:stop", function (e, ui) {

            if ($placeholder) {

                $placeholder.remove();
            }

            var currentIndex = ui.item.index();

            if (currentIndex === initIndex) {

                return;
            }

//            ui.item.parent().children(":nth-child(" + (initIndex + 1) + ")")[currentIndex < initIndex ? "after" : "before"](ui.item);

            var items = this.get(path).slice();

            items.splice(currentIndex, 0, items.splice(initIndex, 1)[0]);

            this.merge(path, items);

        }.bind(this));


        return {
            teardown: function () {

                $sortableWrapper
                    .off("sortable:update")
                    .off("sortable:start")
                    .off("sortable:beforeStop")
                    .off("sortable:activate")
                    .sortable("destroy");
            }.bind(this)
        };
    };

}));
