/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            U = require("./../../../../libs/U"),
            on = require("./../../../../../helpers/on"),

            BackgroundImageSettings = require("./Types/BackgroundImageSettings"),
            ColorSettings = require("./Types/ColorSettings");

        module.exports = factory(
            Ractive,
            U,
            BackgroundImageSettings,
            ColorSettings,
            require("./index.tpl"),
            on
        );

    } else {

        root.PageSectionSettings = factory(
            root.Ractive,
            root.U,
            root.BackgroundImageSettings,
            root.ColorSettings,
            "",
            {client: true}
        );
    }

}(this, function (Ractive, U, BackgroundImageSettings, ColorSettings, template, on) {

    var instanceCounter = 0;

    return Ractive.extend({

        template: template,

        CLASS: {
            self: "E_PageSectionSettings",

            wrapper: "E_PageSectionSettings--wrapper",
            resizer: "E_PageSectionSettings--resizer",
            resizerActive: "E_PageSectionSettings--resizer__active"
        },

        components: {
            BackgroundImageSettings: BackgroundImageSettings,
            ColorSettings: ColorSettings
        },

        partials: {

        },

        decorators: {

            PageSectionSettingsBox: function (node) {

                var $node = $(node);

                this.minHeight = parseFloat(this.parent.$element.css("min-height")) || 0;

                $node
                    .css({
                        position: "relative"
                    })
                    .perfectScrollbar();

                this.parent.observe("elementHeight", function (height) {

                    if (height < this.minHeight) {

                        height = this.minHeight;

                        this.parent.set("elementHeight", this.minHeight);
                    }

                    node.style.maxHeight = height + "px";

                }, {init: false, context: this});

                return {
                    teardown: function () {
                        $node
                            .css({
                                position: ""
                            })
                            .perfectScrollbar("destroy");

                        $node = null;
                    }
                };
            }
        },

        data: function () {

            return {
            };
        },

        onconfig: function () {

            this.EVENT_NS = "PageSectionSettings-" + (++instanceCounter);

            if (on.client) {

                Ractive.$win = Ractive.$win || $(window);

                Ractive.$scrollElement = Ractive.$scrollElement || $("html, body");
            }

            this.set("delayOpening", this.parent.get("anotherSettingsOpened"));
        },

        onrender: function () {

            if (on.client) {

                this.wrapperElement = this.find("." + this.CLASS.wrapper);
                this.$element = $(this.wrapperElement);

                this.$resizer = $(this.find("." + this.CLASS.resizer));

                this.scrollToView();
            }
        },

        oncomplete: function () {

            if (on.client) {

                this.set("elementHeight", this.getSettingsHeight());
            }
        },

        onteardown: function () {

            Ractive.$win.off("." + this.EVENT_NS);
        },

        activateResizer: function (e) {

            var eventData = U.eventData(e),

                lastY = eventData.clientY;

            if (eventData.pointers > 1) {

                return;
            }

            this.$resizer.addClass(this.CLASS.resizerActive);

            Ractive.$win
                .off("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS)
                .on("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS, function (e) {

                    var eventData = U.eventData(e);

                    if (eventData.pointers > 1) {

                        return;
                    }

                    this.set("elementHeight", this.getSettingsHeight() + eventData.clientY - lastY);

                    lastY = eventData.clientY;

                    e.preventDefault();
                    return false;
                }.bind(this))
                .one("mouseup." + this.EVENT_NS + " touchend." + this.EVENT_NS, function (e) {

                    this.$resizer.removeClass(this.CLASS.resizerActive);

                    this.set("elementHeight", this.getSettingsHeight());

                    Ractive.$win.off("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS);

                    e.preventDefault();
                    return false;
                }.bind(this));

            eventData.preventDefault();
            return false;
        },

        getSettingsHeight: function () {

            return this.wrapperElement.getBoundingClientRect().height;
        },

        scrollToView: function () {

            var height = parseFloat(this.$element.css("height")),
                prevSettingsHeight = 0,

                top = this.$element[0].getBoundingClientRect().top,

                pageSection = this.findParent("PageSection"),

                $prevSettings = this.$element.parent().prevAll("." + this.CLASS.self),
                $prevSections = pageSection && pageSection.get$SectionElement().prevAll("." + pageSection.CLASS.self);

            var $temp = $([null]);

            if ($prevSections && $prevSections.length) {

                var instance = this;

                $prevSections.each(function () {

                    $temp[0] = this;

                    var $settings = $temp.find("." + instance.CLASS.self);

                    if ($settings.length) {

                        prevSettingsHeight += parseFloat($settings.css("height"));
                    }
                });
            }

            if ($prevSettings.length) {

                $prevSettings.each(function () {

                    $temp[0] = this;

                    prevSettingsHeight += parseFloat($temp.css("height"));
                });
            }

            if (top + height - prevSettingsHeight > window.innerHeight) {

                var scrollTop = this.$element.offset().top + height - prevSettingsHeight - window.innerHeight;

                Ractive.$scrollElement
                    .stop()
                    .delay(this.get("delayOpening") ? 300 : 0)
                    .animate({
                        scrollTop: scrollTop
                    }, 300);
            }
        }

    });

}));

