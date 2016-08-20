/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageElement = require("./../../"),
            PageElementButton = require("./../../Types/PageElementButton"),
            Ractive = require("ractive"),

            U = require("./../../../../../libs/U"),
            EventEmitter = require("./../../../../../libs/EventEmitter")(),
            on = require("./../../../../../../helpers/on"),

            partials = {
                pageElementEditUI: require("./edit-ui.tpl"),
                pageElementContent: require("./index.tpl")
            };

        module.exports = factory(
            PageElement,
            PageElementButton,
            EventEmitter,
            Ractive,
            U,
            partials,
            on
        );

    } else {

        root.PageElementEmail = factory(
            root.PageElement,
            root.PageElementButton,
            root.EventEmitter,
            root.Ractive,
            root.U,
            {},
            {client: true}
        );
    }

}(this, function (PageElement, PageElementButton, EventEmitter, Ractive, U, partials, on) {

    var CLASS = {
        element: "P_PageElementEmail"
    };

    return PageElement.extend({

        hasEditor: false,

        BUTTON_STATES: PageElementButton.prototype.STATES,

        components: {
        },

        partials: partials,

        data: function () {

            return {
                uploadable: false,
                hasEditUI: false,
                type: "email",
                pulseOutline: false,
                email: ""
            };
        },

        onconfig: function () {

            this.superOnconfig();

            if (Ractive.EDIT_MODE) {

            }
        },

        oninit: function () {

            this.superOninit();

            this.on("*.registerEmail registerEmail", this.registerEmail.bind(this));

            this.observe("sendStatus", function (status) {

                clearTimeout(this.sendStatusTimeout);

                if (status) {

                    this.sendStatusTimeout = setTimeout(this.set.bind(this, "sendStatus", null), 4000);
                }

            }, {init: false});
        },

        registerEmail: function (event, email, editMode) {

            if (editMode || (this.get("sendStatus") || {}).pending) {

                return;
            }

            if (email && email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {

                var params = {
                    _id: this.Page.get("page._id"),
                    email: email
                };

                this.set("sendStatus", {pending: 1});

                this.emailReq = this.req("page.registerUserEmail", params);

                this.emailReq.then(function (res) {

                    if (res && !res.error) {

                        this.set("email", "");

                        return this.set("sendStatus", {ok: 1});
                    }

                    this.set("sendStatus", {error: 1});

                }.bind(this));

                this.emailReq.catch(function (res) {

                    if (res && res.canceled) {

                        return;
                    }

                    this.set("sendStatus", {error: 1});

                });

                return;
            }

            this.set("sendStatus", {error: 1});

        },

        onrender: function () {

            this.superOnrender();

            this.setDefaultValues();
        },

        oncomplete: function () {

            this.superOncomplete();
        },

        setDefaultValues: function () {

        },

        onteardown: function () {

            this.superOnteardown();

            if (this.emailReq) {

                this.emailReq.cancelReq(true);
            }

            clearTimeout(this.sendStatusTimeout);
        }
    });

}));

