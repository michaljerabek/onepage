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

    return function (node, path, componentName, elementType) {

        Ractive.$body = Ractive.$body || $("body");

        var CLASS = {
            item: "P_PageElement__" + elementType,
            sortHandle: "E_PageElementEditUI--sort" ,

            cursorGrabbing: "cursor-grabbing",

            active: "E_Sortable__active"
        };

        this.sortableWrapper = node;
        this.$sortableWrapper = $(node);

        this.$sortableWrapper.sortable({
            forcePlaceholderSize: true,
            handle: "." + CLASS.sortHandle,
            items: "." + CLASS.item,
            keepDir: true,
            activeClass: CLASS.active
        });

        var $placeholder;

        this.$sortableWrapper.on("sortable:update", function (e, ui) {

            //neoznamovat změnu pořadí, pokud byl element odstraněn
            //změna se projeví v příslušném poli
            if (ui.index === -1) {

                return;
            }

            this.fire("elementOrderChanged");

        }.bind(this));

        this.$sortableWrapper.on("sortable:activate", function (e, ui) {

            if ($placeholder) {

                $placeholder.css("position", "");
            }

            ui.item.css({
                position: "absolute",
                top: 0,
                left: 0
            });

        }.bind(this));

        this.$sortableWrapper.on("sortable:start", function () {

            Ractive.$body.addClass(CLASS.cursorGrabbing);

        }.bind(this));

        this.$sortableWrapper.on("sortable:beforeStop", function (e, ui) {

            $placeholder = this.$sortableWrapper.find("[id*='__ph']").css("position", "absolute");

            ui.item.css({
                position: "",
                top: "",
                left: ""
            });

            Ractive.$body.removeClass(CLASS.cursorGrabbing);

        }.bind(this));

        EventEmitter.on("saving.Page." + this.EVENT_NS, function () {

            //při ukládání stránky je potřeba přeřadit pole podle elementů
            var order = this.$sortableWrapper.sortable("toArray");

            if (order.length > 1) {

                var c,

                    components = this.findAllComponents(componentName),

                    sorted = [],

                    current = order.shift();

                do {

                    c = components.length - 1;

                    for (c; c >= 0; c--) {

                        if (components[c].get("id") === current) {

                            components[c].set("stopTransition", true);

                            sorted.push(components[c].get("element"));

                            //nejspíš chyba v Ractivu, ale je nutné nejdříve odstranit všechny observery
                            components[c].cancelObservers();

                            //nastavit elementy podle pořadí, protože byly přetažením nastaveny na jiných pozicích,
                            //takže při přeřazení dat v poli by se zobrazovaly nesprávně
                            this.$sortableWrapper.append(this.$sortableWrapper.find("#" + current));
                        }
                    }

                    current = order.shift();

                } while (current);

                this.set(path, []);
                this.set(path, sorted);
            }

        }.bind(this));

        EventEmitter.on("saved.Page." + this.EVENT_NS, function () {

            var components = this.findAllComponents(componentName),

                c = components.length - 1;

            for (c; c >= 0; c--) {

                components[c].set("stopTransition", false);
            }

        }.bind(this));

        return {
            teardown: function () {

                EventEmitter
                    .off("saving.Page." + this.EVENT_NS)
                    .off("saved.Page." + this.EVENT_NS);

                this.$sortableWrapper
                    .off("sortable:update")
                    .off("sortable:start")
                    .off("sortable:beforeStop")
                    .off("sortable:activate")
                    .sortable("destroy");
            }.bind(this)
        };
    };

}));
