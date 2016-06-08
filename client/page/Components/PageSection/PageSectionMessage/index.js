/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var Ractive = require("ractive");

/*
 * PageSectionMessage zobrazí zprávu u příslušné sekce stránky,
 * pokud nastane událost pageSectionMessage. Objekt události může obshovat:
 * {
 *     title: "title",
 *     text: "text",
 *     status: "success",
 *     timeout: 1000 //doba za jakou zpráva zmizí (v případě neuvedení se musí zajistit
 *                   //odstranění zprávy jinak -> odeslat událost s hodnotou null)
 * }
 */

module.exports = Ractive.extend({

    template: require("./index.tpl"),

    CLASS: {
        self: "E_PageSectionMessage",

        message: "E_PageSectionMessage--message",
        title: "E_PageSectionMessage--title",
        text: "E_PageSectionMessage--text",

        success: "E_PageSectionMessage--message__success",
        error: "E_PageSectionMessage--message__error",
        info: "E_PageSectionMessage--message__info",
        warn: "E_PageSectionMessage--message__warn"
    },

    components: {
    },

    partials: {
    },

    data: function () {

        return {
            messageStatusClass: "",

            message: null,

            showMessage: false
        };
    },

    onrender: function () {

    },

    onconfig: function () {

        this.observe("message", function (message) {

            if (!message) {

                return;
            }

            clearTimeout(this.messageTimeout);

            if (message.timeout) {

                this.messageTimeout = setTimeout(function() {

                    this.set("showMessage", false);

                }.bind(this), message.timeout);
            }

            switch (message.status) {
                case "success": this.set("messageStatusClass", this.CLASS.success);
                    break;
                case "error"  : this.set("messageStatusClass", this.CLASS.error);
                    break;
                case "warn"   : this.set("messageStatusClass", this.CLASS.warn);
                    break;
                case "info"   : this.set("messageStatusClass", this.CLASS.info);
                    break;
                default       : this.set("messageStatusClass", "");
            }
        });

        this.PageSection = this.getPageSection();

        this.PageSection.on("pageSectionMessage *.pageSectionMessage", function (message) {

            clearTimeout(this.messageTimeout);

            if (message) {

                this.set("message", message);
            }

            this.set("showMessage", !!message);

        }.bind(this));
    },

    oncomplete: function () {
    },

    onteardown: function () {

        clearTimeout(this.messageTimeout);
    }

});
