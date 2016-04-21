/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $, MutationObserver*/
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

            wrapper: "E_PageSectionSettings--wrapper",

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

            ProgressBar: require("./../../../../libs/Components/ProgressBar")
        },

        partials: {

        },

        decorators: {

            PageSectionSettingsBox: function (node, scrollingElementSelector) {

                var $node = $(node),
                    $scrollingElement = !scrollingElementSelector || $node.is(scrollingElementSelector) ? $node : $node.find(scrollingElementSelector),

                    refreshThrottle = null,
                    refreshScrollbars = function () {

                        clearTimeout(refreshThrottle);

                        refreshThrottle = setTimeout(function() {

                            $scrollingElement.perfectScrollbar("update");

                        }, 100);
                    };

                this.parent.$resizableBox = $node;
                this.parent.resizableBox  = node;

                this.parent.minmaxButton = this.parent.find("." + this.parent.CLASS.minmax);

                this.parent.minmaxButton.classList.add(this.parent.CLASS.minmaxMin);
                this.parent.resizableBox.classList.add(this.parent.CLASS.resizableBox);

                this.initHeight      = this.parent.getSettingsHeight();
                this.beforeHeight    = this.initHeight;

                this.minHeight       = parseFloat(this.parent.$resizableElement.css("min-height")) || 0;

                this.minResizeHeight = parseFloat($node.attr("data-min-resize-height")) || 0;
                this.maxResizeHeight = parseFloat($node.attr("data-max-resize-height")) || 0;

                var getRectsForScrollables = function () {

                        var rects = {};

                        if ($scrollingElement) {

                            $scrollingElement.each(function (i, el) {

                                rects[i] = el.getBoundingClientRect();
                            });
                        }

                        return rects;
                    },

                    lastRects = getRectsForScrollables(),

                    lastTab = this.get("openTab"),

                    lastMutation = +new Date(),

                    onContentChange = function () {

                        var isMax = this.parent.minmaxButton.classList.contains(this.parent.CLASS.minmaxMax) && !this.parent.minmaxButton.classList.contains(this.parent.CLASS.minmaxMin),
                            isMin = !isMax;

                        var currentRects = getRectsForScrollables();

                        $.each(currentRects, function (i, rect) {

                            if (rect.width !== lastRects[i].width || rect.height !== lastRects[i].height) {

                                if (isMin) {

                                    this.beforeHeight = this.parent.getSettingsHeight();
                                }

                                if (!this.parent.wasResized) {

                                    this.parent.minmax(null, isMax, isMin);

                                } else {

                                    this.parent.wasResized = false;

                                    this.parent.set("elementHeight", this.parent.getSettingsHeight());
                                }

                                return false;
                            }
                        }.bind(this));

                        lastRects = currentRects;

                    }.bind(this),

                    onContentChangeTimeout = null,

                    contentObserver = new MutationObserver(function () {

                        clearTimeout(onContentChangeTimeout);

                        var currentTime = +new Date();

                        if (currentTime - lastMutation < 50) {

                            onContentChangeTimeout = setTimeout(onContentChange, 100);

                            lastMutation = currentTime;

                            return;
                        }

                        if (this.get("openTab") !== lastTab || this.parent.find("." + this.parent.CLASS.resizerActive)) {

                            return;
                        }

                        onContentChange();

                        lastMutation = currentTime;

                }.bind(this));

                contentObserver.observe(this.parent.resizableBox, { attributes: true, childList: true, characterData: true, subtree: true });

                this.observe("openTab", function (tab) {

                    //při změně tabu je potřeba zablokovat MutationObserver, protože je potřeba změnu veliosti zajistit jiným způsobem.
                    lastTab = tab;

                    var saveBeforeHeight = this.beforeHeight,

                        isMax = this.parent.minmaxButton.classList.contains(this.parent.CLASS.minmaxMax) && !this.parent.minmaxButton.classList.contains(this.parent.CLASS.minmaxMin),
                        isMin = !isMax;

                    if (isMin) {

                        this.beforeHeight = this.parent.getSettingsHeight();
                    }

                    this.parent.minmax(null, isMax, isMin);

                    this.beforeHeight = saveBeforeHeight;

                }, {init: false, defer: true, context: this});

                this.parent.minmax = this.parent.minmax || function (event, forceMax, forceMin) {

                    contentObserver.disconnect();

                    if (event) {

                        event.original.srcEvent.stopPropagation();
                        event.original.srcEvent.preventDefault();
                    }

                    //posuvníky je potřeba aktualizovat až na konci
                    this.doNotUpdateScrollbars = true;

                    this.parent.$resizableBox
                        .off("transitionend.resize-" + this.parent.EVENT_NS)
                        .css({
                            transition: "none"
                        });

                    clearTimeout(this.clearAnimStyles);

                    //použije se, pokud nenastane transitionend
                    this.clearAnimStyles = setTimeout(function () {

                        this.parent.resizableBox.style.height = "";

                        contentObserver.observe(this.parent.resizableBox, { attributes: true, childList: true, characterData: true, subtree: true });

                    }.bind(this), 1000);

                    this.parent.resizableBox.style.height = "";

                    var currentHeight = this.parent.get("elementHeight"),

                        maximize = false;

                    //zmenšit na výchozí velikost
                    if (forceMin || (!forceMax && this.parent.minmaxButton.classList.contains(this.parent.CLASS.minmaxMax))) {

                        this.parent.set("elementHeight", this.beforeHeight === currentHeight && !forceMin ? this.initHeight : this.beforeHeight);

                        this.parent.minmaxButton.classList.remove(this.parent.CLASS.minmaxMax);
                        this.parent.minmaxButton.classList.add(this.parent.CLASS.minmaxMin);

                    //zvětšit na maximální velikost
                    } else {

                        this.beforeHeight = this.parent.get("elementHeight");

                        if (this.maxResizeHeight) {

                            this.parent.set("elementHeight", this.maxResizeHeight);
                        }

                        this.parent.minmaxButton.classList.remove(this.parent.CLASS.minmaxMin);
                        this.parent.minmaxButton.classList.add(this.parent.CLASS.minmaxMax);

                        maximize = true;
                    }

                    //zjistit konečné rozměry boxu
                    var resizableBoxRect = this.parent.resizableBox.getBoundingClientRect();

                    //po zjištění rozměrů po změně velikosti, je potřeba vrátit původní hodnoty kvůli animaci
                    this.parent.set("elementHeight", currentHeight);

                    //pokud se velikost nezmění může se funkce ukončit
                    if (resizableBoxRect.height === currentHeight) {

                        this.doNotUpdateScrollbars = false;

                        this.parent.$resizableBox.css({
                            transition: ""
                        });

                        return;
                    }

                    //začátek animace: zafixování současné velikosti
                    this.parent.resizableBox.style.height = currentHeight + "px";
                    //Je potřeba odstranit maxVelikost, aby bylo možné roztáhnout element na požadovanou velikost.
                    //V případě, že se změní obsah a box není maximalizovaný, je potřeba velikost zafixovat,
                    //protože by měla zůstat stejná.
                    this.parent.resizableBox.style.maxHeight = (forceMin ? currentHeight + "px" : "none");

                    if (maximize && this.maxResizeHeight) {

                        this.parent.resizableBox.style.maxHeight = this.maxResizeHeight + "px";
                    }

                    this.parent.resizableBox.style.minHeight = this.minHeight + "px";

                    setTimeout(function() {

                        //spuštění animace: konečná velikost
                        this.parent.resizableBox.style.height = resizableBoxRect.height + "px";

                        var eventId = +new Date();

                        this.parent.$resizableBox
                            .css({
                                transition: ""
                            })
                            .on("transitionend.resize-" + this.parent.EVENT_NS + "." + eventId, function (e) {

                                if (e.originalEvent.propertyName === "height") {

                                    //iOS fix
                                    this.parent.$resizableBox.css({
                                        transition: "none"
                                    });

                                    //přiřadit aktuální vekost do max-rozměrů pro správnou funkčnost roztahování
                                    this.parent.set("elementHeight", this.parent.getSettingsHeight());

                                    clearTimeout(this.clearAnimStyles);
                                    this.parent.resizableBox.style.height = "";

                                    $scrollingElement.perfectScrollbar("update");

                                    this.parent.$resizableBox.off("transitionend.resize-" + this.parent.EVENT_NS + "." + eventId);

                                    lastRects = getRectsForScrollables();

                                    contentObserver.observe(this.parent.resizableBox, { attributes: true, childList: true, characterData: true, subtree: true });

                                    //iOS fix
                                    setTimeout(function() {

                                        this.parent.$resizableBox.css({
                                            transition: ""
                                        });

                                    }.bind(this), 0);
                                }
                            }.bind(this));

                        this.parent.scrollToView(resizableBoxRect.height, true);

                        this.doNotUpdateScrollbars = false;

                    }.bind(this), 0);

                }.bind(this);

                $scrollingElement
                    .css({
                        position: "relative"
                    })
                    .perfectScrollbar();

                this.parent.observe("elementHeight", function (height) {

                    if (height < this.minHeight) {

                        height = this.minHeight;

                        this.parent.set("elementHeight", this.minHeight);
                    }

                    if (this.maxResizeHeight && height > this.maxResizeHeight) {

                        height = this.maxResizeHeight;

                        this.parent.set("elementHeight", this.maxResizeHeight);
                    }

                    this.parent.resizableBox.style.maxHeight = height + "px";

                    if (this.minResizeHeight) {

                        this.parent.resizableBox.style.minHeight = height >= this.minResizeHeight ? this.minResizeHeight + "px" : height + "px";
                    }

                    if (!this.doNotUpdateScrollbars) {

                        refreshScrollbars();
                    }

                }, {init: false, context: this});

                return {
                    teardown: function () {

                        contentObserver.disconnect();

                        clearTimeout(refreshThrottle);

                        $scrollingElement
                            .css({
                                position: ""
                            })
                            .perfectScrollbar("destroy");

                        $node.off("transitionend.resize-" + this.EVENT_NS);

                        $scrollingElement = null;
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

            //Počkat až se zavře jiné nastavení ve stejné sekci?
            this.set("delayOpening", this.parent.get("anotherSettingsOpened"));
        },

        onrender: function () {

            if (on.client) {

                this.self = this.find("." + this.CLASS.self);
                this.$self = $(this.self);

                this.resizableElement = this.find("." + this.CLASS.wrapper);
                this.$resizableElement = $(this.resizableElement);

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

            eventData.target.classList.add(this.CLASS.resizerActive);

            Ractive.$win
                .off("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS)
                .on("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS, function (e) {

                    var eventData = U.eventData(e);

                    if (eventData.pointers > 1) {

                        return;
                    }

                    this.set("elementHeight", this.getSettingsHeight() + eventData.clientY - lastY);

                    lastY = eventData.clientY;

                    if (this.$resizableBox) {

                        this.minmaxButton.classList.remove(this.CLASS.minmaxMax);

                        this.$resizableBox.css({
                            transition: "none"
                        });
                    }

                    e.preventDefault();
                    return false;

                }.bind(this))
                .one("mouseup." + this.EVENT_NS + " touchend." + this.EVENT_NS, function (e) {

                    this.wasResized = true;

                    eventData.target.classList.remove(this.CLASS.resizerActive);

                    this.set("elementHeight", this.getSettingsHeight());

                    Ractive.$win.off("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS);

                    if (this.$resizableBox) {

                        this.$resizableBox.css({
                            transition: ""
                        });
                    }

                    setTimeout(function() {

                        this.wasResized = false;

                    }.bind(this), 0);

                    e.preventDefault();
                    return false;

                }.bind(this));

            eventData.preventDefault();
            return false;
        },

        getSettingsHeight: function () {

            return this.resizableElement.getBoundingClientRect().height;
        },

        scrollToView: function (expectedHeight, isMaximized) {

            var height = expectedHeight || parseFloat(this.$resizableElement.css("height")),
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

