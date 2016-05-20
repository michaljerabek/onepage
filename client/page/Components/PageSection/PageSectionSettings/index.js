/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $, MutationObserver*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            U = require("./../../../../libs/U"),
            on = require("./../../../../../helpers/on"),

            BackgroundImageSettings = require("./Types/BackgroundImageSettings"),
            ColorSettings = require("./Types/ColorSettings"),
            SectionSettings = require("./Types/SectionSettings");

        module.exports = factory(
            Ractive,
            U,
            BackgroundImageSettings,
            ColorSettings,
            SectionSettings,
            require("./index.tpl"),
            on
        );

    } else {

        root.PageSectionSettings = factory(
            root.Ractive,
            root.U,
            root.BackgroundImageSettings,
            root.ColorSettings,
            root.SectionSettings,
            "",
            {client: true}
        );
    }

}(this, function (Ractive, U, BackgroundImageSettings, ColorSettings, SectionSettings, template, on) {

    var instanceCounter = 0;

    /*
     * Komponent nastavení sekce. Komponent by měl obsahovat konkrétní komponenty (jako "partial" - "content")
     * s nastavením. Tyto komponenty se registrují zde (a nachází se ve složce "/Types").
     *
     * Komponenty uvnitř "PageSectionSettings" by měli být element s dekorátorem "PageSectionSettingsBox",
     * který zajistí správné zvětšovaní/zmenšování nastavení a přidá posuvníky.
     */

    return Ractive.extend({

        template: template,

        CLASS: {
            self: "E_PageSectionSettings",
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
            BackgroundImageSettings: BackgroundImageSettings,
            ColorSettings: ColorSettings,
            SectionSettings: SectionSettings,

            ProgressBar: require("./../../../../libs/Components/ProgressBar")
        },

        partials: {

        },

        decorators: {
            ResizableBox: require("./../../../../libs/Decorators/ResizableBox")
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

            this.onresizableboxinit = this.scrollToView;
            this.onresizableboxend = this.scrollToView;

            //Počkat až se zavře jiné nastavení ve stejné sekci?
            this.set("delayOpening", this.parent.get("anotherSettingsOpened"));
        },

        onrender: function () {

            if (on.client) {

                this.self = this.find("." + this.CLASS.self);
                this.$self = $(this.self);
            }
        },

        oncomplete: function () {

            if (on.client) {

            }
        },

        onteardown: function () {

            Ractive.$win.off("." + this.EVENT_NS);
        },

        scrollToView: function (expectedRect, isMaximized) {

            var height = (expectedRect && expectedRect.height) || parseFloat(this.$resizableElement.css("height")),
                prevSettingsHeight = 0,

                top = this.$self[0].getBoundingClientRect().top,

                pageSection = !isMaximized && this.getPageSection(),

                $prevSettings = !isMaximized && this.$self.prevAll("." + this.CLASS.self),
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
                    .delay(this.get("delayOpening") && !isMaximized ? 300 : 0)
                    .animate({
                        scrollTop: scrollTop
                    }, this.OPTIONS.SCROLL_DURATION, this.OPTIONS.SCROLL_EASING);
            }
        }

    });

}));

