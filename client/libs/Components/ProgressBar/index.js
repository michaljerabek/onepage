/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var Ractive = require("ractive");

module.exports = Ractive.extend({

    template: require("./index.tpl"),

    CLASS: {
        self: "E_ProgressBar",
        progress: "E_ProgressBar--progress",

        success: "E_ProgressBar__success",
        error: "E_ProgressBar__error",
        warn: "E_ProgressBar__warn"
    },

    components: {
    },

    partials: {
    },

    data: function () {

        return {
            active: false,
            error: false,
            warn: false,
            success: false,

            progress: 0,

            data: {},
            errors: {}
        };
    },

    onconfig: function () {

        this.parent.on("progressBarProgress *.progressBarProgress", function (progress) {

            if (!progress || !progress.id || typeof progress.progress === "undefined") {

                throw "ProgressBar: Progress object must be like: {id: 'uniqueId', progress: 50};";
            }

            var data = this.get("data"),

                hasData = false;

            $.each(data, function () {

                hasData = true;

                return false;
            });

            if (!hasData) {

                this.$progress.css({
                    transition: "none"
                });

                this.set("progress", 0);
                this.set("success", false);
                this.set("warn", false);
                this.set("error", false);

                setTimeout(function() {

                    this.$progress.css({
                        transition: ""
                    });

                    this.set("data." + progress.id, progress.progress);

                    this.set("active", true);

                    if (progress.progress === 100) {

                        this.activeTimeout = setTimeout(this.set.bind(this, "active", false), 500);
                    }

                }.bind(this), 0);

            } else {

                this.set("data." + progress.id, progress.progress);
            }

        }.bind(this));

        this.parent.on("progressBarProgress *.progressBarError", function (progress) {

            if (this.get("progress") === 100) {

                this.set("progress", 0);
            }

            var data = this.get("data"),

                hasData = false;

            $.each(data, function () {

                hasData = true;

                return false;
            });

            if (!hasData) {

                this.$progress.css({
                    transition: "none"
                });

                this.set("success", false);
                this.set("warn", false);

                setTimeout(function() {

                    this.$progress.css({
                        transition: ""
                    });

                    this.set("data." + progress.id, 100);
                    this.set("active", true);

                    this.activeTimeout = setTimeout(this.set.bind(this, "active", false), 500);

                }.bind(this), 0);

            } else {

                this.set("data." + progress.id, 100);
            }

            this.set("error", progress.id);
            this.set("errors." + progress.id, true);

        }.bind(this));

        this.observe("data", function (data) {

            if (this.skipDataObserver) {

                return;
            }

            var totalProgress = 0,

                items = 0,

                errors = 0;

            $.each(data, function (id, progress) {

                totalProgress += progress;

                items++;

                if (this.get("errors." + id)) {

                    errors++;
                }

            }.bind(this));

            this.set("progress", totalProgress ? totalProgress / items : 0);

            if (errors) {

                this.set("warn", errors < items);
            }

        }, {init: false});

        this.observe("progress", function (state) {

            clearTimeout(this.activeTimeout);

            if (state === 100) {

                if (!this.get("error") && !this.get("warn")) {

                    this.set("success", true);
                }

                this.set("active", false);

                this.skipDataObserver = true;

                this.set("data", {});
                this.set("errors", {});

                this.skipDataObserver = false;
            }

        }, {init: false, defer: true});
    },

    onrender: function () {

        this.$progress = $(this.find("." + this.CLASS.progress));
    },

    oncomplete: function () {
    }

});
