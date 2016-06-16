/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            U = require("./../../../../libs/U"),
            on = require("./../../../../../helpers/on");

        module.exports = factory(
            Ractive,
            U,
            require("./index.tpl"),
            on
        );

    } else {

        root.PageSectionSettings = factory(
            root.Ractive,
            root.U,
            "",
            {client: true}
        );
    }

}(this, function (Ractive, U, template, on) {

    var instanceCounter = 0;

    /*
     * Komponent nastavení sekce.
     * *
     * Komponenty odvozené od "PageSectionSettings" by měly mít element s dekorátorem "PageSectionSettingsBox",
     * který zajistí správné zvětšovaní/zmenšování nastavení a přidá posuvníky.
     */

    return Ractive.extend({

        template: template,

        CLASS: {
            self: "E_PageSectionSettings",
            transitionWrapper: "E_PageSectionSettings--transition-wrapper",
            multipleTabs: "E_PageSectionSettings__multiple-tabs",

            wrapper: "E_PageSectionSettings--wrapper",
            scrollingContent: "E_PageSectionSettings--scrolling-content",
            scrollingContentHideOverlay: "E_PageSectionSettings--scrolling-content__hide-overlay",

            resizer: "E_PageSectionSettings--resizer",
            resizerActive: "E_PageSectionSettings--resizer__active",
            resizableBox: "E_PageSectionSettings--resizable-box",

            minmax: "E_PageSectionSettings--min-max",
            minmaxMax: "E_PageSectionSettings--min-max__max",
            minmaxMin: "E_PageSectionSettings--min-max__min"
        },

        OPTIONS: {
            SCROLL_EASING: on.client ? $.bez([0.1, 0.4, 0.4, 1]) : "",
            SCROLL_DURATION: 300
        },

        components: {
            ProgressBar: require("./../../../../libs/Components/ProgressBar")
        },

        partials: {
            Text: require("./../../../../libs/Components/UI/Text/index.tpl"),
            titleLangIcon: require("./partials/title-lang-icon.tpl")
        },

        decorators: {
            ResizableBox: require("./../../../../libs/Decorators/ResizableBox")
        },

        data: function () {

            return {
            };
        },

        superOnconfig: function () {

            this.EVENT_NS = "PageSectionSettings-" + (++instanceCounter);

            if (on.client) {

                Ractive.$win = Ractive.$win || $(window);

                Ractive.$scrollElement = Ractive.$scrollElement || $("html, body");
            }

            this.onresizableboxinit = this.scrollToView;
            this.onresizableboxend = this.scrollToView;

            //Počkat až se zavře jiné nastavení ve stejné sekci?
            this.set("delayOpening", this.parent.get("anotherSettingsOpened"));
        },

        superOnrender: function () {

            if (on.client) {

                this.self = this.find("." + this.CLASS.self);
                this.$self = $(this.self);
                this.$transitionWrapper = this.$self.closest("." + this.CLASS.transitionWrapper);
            }
        },

        superOncomplete: function () {

            this.set("completed", true);

            if (on.client) {

            }
        },

        superOnteardown: function () {

            clearTimeout(this.scrollToViewTimeout);

            Ractive.$win.off("." + this.EVENT_NS);
        },

        onconfig: function () {
            this.superOnconfig();
        },

        onrender: function () {
            this.superOnrender();
        },

        oncomplete: function () {
            this.superOncomplete();
        },

        onteardown: function () {
            this.superOnteardown();
        },

        scrollToView: function (expectedRect, isMaximized) {

            var delay = this.get("delayOpening") && !isMaximized ? 300 : 0;

            clearTimeout(this.scrollToViewTimeout);

            this.scrollToViewTimeout = setTimeout(function() {

                var height = (expectedRect && expectedRect.height) || parseFloat(this.$resizableElement.css("height")),
                    prevSettingsHeight = 0,

                    top = this.$self[0].getBoundingClientRect().top,

                    pageSection = !isMaximized && this.getPageSection(),

                    $prevSettings = !isMaximized && this.$transitionWrapper.siblings("." + this.CLASS.transitionWrapper),
                    $prevSections = pageSection && pageSection.get$SectionElement().prevAll("." + pageSection.CLASS.self),

                    $temp = $([null]);

                //pokud je otevřeno nastavení v předchozí sekci, pak bude zavřeno,
                //takže je potřeba jeho výšku odečíst
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

                //pokud je otevřeno jiné nastavení ve stejné sekci, pak bude zavřeno,
                //takže je potřeba jeho výšku odečíst
                if ($prevSettings && $prevSettings.length) {

                    $prevSettings.each(function () {

                        $temp[0] = this;

                        prevSettingsHeight += parseFloat($temp.css("height"));
                    });
                }

                //pokud by bylo nastavení pod dolním okrajem okna -> seskrolovat dolu
                if (top + height - prevSettingsHeight > window.innerHeight) {

                    var scrollTop = this.$self.offset().top + (height > window.innerHeight ? window.innerHeight : height) - prevSettingsHeight - window.innerHeight;

                    Ractive.$scrollElement
                        .stop()
                        //zdržet, pokud je potřeba počkat na zavření jiného nastavení
                        .animate({
                            scrollTop: scrollTop
                        }, this.OPTIONS.SCROLL_DURATION, this.OPTIONS.SCROLL_EASING);
                }
            }.bind(this), delay);
        }
    });

}));

