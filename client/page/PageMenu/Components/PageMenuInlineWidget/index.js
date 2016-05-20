/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
var InlineWidget = require("./../../../../libs/Components/InlineWidget");

module.exports = InlineWidget.extend({

    components: {
    },

    partials: {
    },

    decorators: {
    },

    data: function () {

        return {
            type: "PageMenu"
        };
    },

    onconfig: function () {

        if (this.parent) {

            var connectWith = this.get("connectWith");

            if (connectWith) {

                this.connectWithObserver = this.parent.observe(connectWith.opener, function (current) {

                    this.parent.set("__InlineWidget." + connectWith.id, !!current);

                }.bind(this), {init: false});

                this.set("delayOpening", !!this.parent.get("__InlineWidget." + connectWith.id));

            } else  {

                this.parent.set("__InlineWidget", {});
            }
        }
    },

    onrender: function () {
    },

    oncomplete: function () {
    },

    onteardown: function () {

        if (this.connectWithObserver) {

            this.connectWithObserver.cancel();
        }
    }

});
