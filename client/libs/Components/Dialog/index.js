/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*//*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),
            EventEmitter = require("./../../EventEmitter")(),
            on = require("./../../../../helpers/on"),

            template = require("./index.tpl"),
            Button = require("./../UI/Button/index.tpl");

        module.exports = factory(Ractive, EventEmitter, template, Button, on);

    } else {

        root.Dialog = factory(root.Ractive, $({}), "", root.Button, {client: true});
    }

}(this, function (Ractive, EventEmitter, template, Button, on) {

    return Ractive.extend({

        CLASS: {
            box: "Dialog--box",
            overlay: "Dialog--overlay"
        },

        template: template,

        components: {
        },

        partials: {
            Button: Button
        },

        decorators: {
        },

        data: function () {

            return {
                messages: []
            };
        },

        onconfig: function () {

            if (on.client) {

                EventEmitter.on("show.Dialog", function (e, message) {
                    this.handleNewDialog.call(this, message);
                }.bind(this));

                window.EE = EventEmitter;
            }

            this.root.on("showDialog *.showDialog", this.handleNewDialog.bind(this));

            this.on("handleUserInput", this.handleUserInput);
            this.on("closeDialog", this.closeDialog);
        },

        onrender: function () {

            Ractive.$win = Ractive.$win || $(window);
            Ractive.$scrollingElement = Ractive.$scrollingElement || $("html, body");
        },

        oncomplete: function () {
        },

        onteardown: function () {

            clearTimeout(this.nextMessageTimeout);
            clearTimeout(this.closeDialogTimeout);
            clearTimeout(this.closeDialogCounterTimeout);

            this.root.off("showDialog");

            Ractive.$win.off(".Dialog");
            Ractive.$scrollingElement.off(".Dialog");

            if (this.$overlay) {

                this.$overlay.off(".Dialog");
            }

            EventEmitter.off(".Dialog");
        },

        handleNewDialog: function (message, _message) {

            message = _message || message;

            this.push("messages", message);

            if (this.get("messages").length === 1) {

                this.handleNextMessage();
            }
        },

        handleUserInput: function (event, data) {

            clearTimeout(this.closeDialogTimeout);
            clearTimeout(this.closeDialogCounterTimeout);

            //data[0] - název události
            //data[1] - objekt události
            //data[2] - kontext události
            //data[3] - funkce

            if (data && data[3]) {

                data[3].call(data[2], data[1]);

            } else if (data && data[0]) {

                if (data[2]) {

                    data[2].fire(data[0], data[1]);

                } else {

                    EventEmitter.trigger(data[0], data[1]);
                }
            }

            this.closeDialog();
        },

        closeDialog: function () {

            clearTimeout(this.closeDialogTimeout);
            clearTimeout(this.closeDialogCounterTimeout);

            this.shift("messages");

            if (this.get("messages").length) {

                this.handleNextMessage();

            } else {

                this.$lastBox = null;
                this.$lastBoxFocus = null;

                Ractive.$win.off(".Dialog");
                Ractive.$scrollingElement.off(".Dialog");
            }
        },

        handleNextMessage: function () {

            if (this.$lastBox) {

                Ractive.$win.off(".Dialog");
                Ractive.$scrollingElement.off(".Dialog");
            }

            clearTimeout(this.closeDialogTimeout);
            clearTimeout(this.closeDialogCounterTimeout);
            clearTimeout(this.nextMessageTimeout);

            this.nextMessageTimeout = setTimeout(function() {

                var currentMessage = this.get("messages[0]");

                if (currentMessage.timeout) {

                    this.activateAutoClose(currentMessage);

                }

                this.$lastBox = $("." + this.CLASS.box + ":not([data-ractive-transition^='outro'])");

                this.$lastBoxFocus = this.$lastBox.find("[tabindex='1001']").focus();

                Ractive.$win
                    .on("scroll.Dialog mousewheel.Dialog DOMMouseScroll.Dialog keydown.Dialog", function (e) {

                        if (e.type === "keydown" && (e.which < 33 || e.which > 40)) {

                            return true;
                        }

                        return false;
                    });

            }.bind(this), 0);

            this.$overlay = this.$overlay || $("." + this.CLASS.overlay).on("touchmove.Dialog touchstart.Dialog mousedown.Dialog", function () {

                return false;
            });
        },

        activateAutoClose: function (currentMessage) {

            var action = currentMessage.close ? "close" : "dismiss";

            this.closeDialogTimeout = setTimeout(function() {

                clearTimeout(this.closeDialogCounterTimeout);

                this.handleUserInput(null, [
                    currentMessage[action].fire,
                    currentMessage[action].event,
                    currentMessage[action].context,
                    currentMessage[action].exec
                ]);

            }.bind(this), currentMessage.timeout + 100);

            var textPath = "messages[0]." + action + ".text",
                text = this.get(textPath) || "Zavřít",

                remaining = Math.round(Math.max(0, currentMessage.timeout) / 1000);

            this.set(textPath, text + " (" + remaining + ")");

            this.closeDialogCounterTimeout = setInterval(function () {

                currentMessage.timeout -= 1000;

                remaining = Math.round(Math.max(0, currentMessage.timeout) / 1000);

                this.set(textPath, text + " (" + remaining + ")");

            }.bind(this), 1000);
        }
    });
}));
