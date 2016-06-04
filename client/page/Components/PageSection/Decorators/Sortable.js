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

        this.$sortableWrapper.on("sortable:update", function () {

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

            var order = this.$sortableWrapper.sortable("toArray");

            if (order.length > 1) {

                var b,

                    buttons = this.findAllComponents(componentName),

                    sorted = [],

                    current = order.shift();

                do {

                    b = buttons.length - 1;

                    for (b; b >= 0; b--) {

                        if (buttons[b].get("id") === current) {

                            buttons[b].set("stopTransition", true);

                            buttons[b].cancelObservers();

                            sorted.push(buttons[b].get("element"));

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

            var buttons = this.findAllComponents(componentName),

                b = buttons.length - 1;

            for (b; b >= 0; b--) {

                buttons[b].set("stopTransition", false);
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
