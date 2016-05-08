/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $, MutationObserver*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            U = require("./../../../../libs/U"),
            on = require("./../../../../../helpers/on"),

            components = {
                IconBrowser: require("./../../../../libs/Components/FileBrowser/IconBrowser"),
                ColorPicker: require("./../../../../libs/Components/ColorPicker"),
                ColorPickerPalette: require("./../../../../libs/Components/ColorPicker/Components/ColorPickerPalette")
            }/*,

            ColorSettings = require("./Types/ColorSettings")*/;

        module.exports = factory(
            Ractive,
            U,
            //            "ColorSettings",
            components,
            require("./index.tpl"),
            on
        );

    } else {

        root.PageElementSettings = factory(
            root.Ractive,
            root.U,
            root.ColorSettings,
            "",
            {client: true}
        );
    }

}(this, function (Ractive, U/*, ColorSettings*/, components, template, on) {

    /*
     * Komponent s nastavením elementu v sekci. Obsah by měl tvořit komponent s konkrtétním nastavením
     * (měl by být uložen v "/Types"). Každý komponent by měl obsahovat element s dekorátorem "PageElementSettingsBox",
     * který zajistí roztahování nastavení a přidá posuvníky. Tento element by měl mít nastaveno max-width a max-height,
     * pro nastavení výchozí velikosti.
     */

    var instanceCounter = 0;

    return Ractive.extend({

        template: template,

        CLASS: {
            self: "E_PageElementSettings",

            wrapper: "E_PageElementSettings--wrapper",
            content: "E_PageElementSettings--content",

            resizer: "E_PageElementSettings--resizer",
            resizerActive: "E_PageElementSettings--resizer__active",
            resizableBox: "E_PageElementSettings--resizable-box",
            scrollingContent: "E_PageElementSettings--scrolling-content",

            minmax: "E_PageElementSettings--min-max",
            minmaxMax: "E_PageElementSettings--min-max__max",
            minmaxMin: "E_PageElementSettings--min-max__min"
        },

        OPTIONS: {
            SETTINGS_OFFSET: -10
        },

        components: components || {
            //            ColorSettings: ColorSettings
        },

        partials: {

        },

        decorators: {

            PageElementSettingsBox: function (node, scrollingElementSelector) {

                var $node = $(node),
                    $scrollingElement = !scrollingElementSelector || $node.is(scrollingElementSelector) ? $node : $node.find(scrollingElementSelector),

                    $scrollingContent = $scrollingElement.find("." + this.CLASS.scrollingContent),

                    refreshThrottle = null,
                    refreshScrollbars = function () {

                        clearTimeout(refreshThrottle);

                        refreshThrottle = setTimeout(function() {

                            $scrollingElement.each(function (i, element) {

                                var $element = $(element),

                                    elementRect = element.getBoundingClientRect(),
                                    contentRect = element.firstChild.getBoundingClientRect();

                                if (elementRect.bottom > contentRect.bottom) {

                                    $element.stop()
                                        .animate({
                                            scrollTop: element.firstChild.offsetHeight - element.offsetHeight
                                        }, {
                                            duration: 200,
                                            progress: function () {
                                                clearTimeout(refreshScrollbars);
                                            },
                                            complete: function () {
                                                $element.perfectScrollbar("update");
                                            }
                                        });

                                } else {

                                    $element.stop().perfectScrollbar("update");
                                }
                            });

                        }, 50);
                    };

                this.$resizableBox = $node;
                this.resizableBox  = node;

                this.minmaxButton = this.find("." + this.CLASS.minmax);

                this.minmaxButton.classList.add(this.CLASS.minmaxMin);
                this.resizableBox.classList.add(this.CLASS.resizableBox);

                this.initWidth       = this.getSettingsWidth();
                this.initHeight      = this.getSettingsHeight();
                this.beforeWidth     = this.initWidth;
                this.beforeHeight    = this.initHeight;

                this.minHeight       = parseFloat(this.$resizableElement.css("min-height")) || 0;
                this.minWidth        = parseFloat(this.$resizableElement.css("min-width"))  || 0;

                this.minResizeHeight = parseFloat($node.attr("data-min-resize-height"))     || 0;
                this.minResizeWidth  = parseFloat($node.attr("data-min-resize-width"))      || 0;

                this.maxResizeHeight = parseFloat($node.attr("data-max-resize-height"))     || 0;
                this.maxResizeWidth  = parseFloat($node.attr("data-max-resize-width"))      || 0;

                if (this.maxResizeWidth) {

                    if (this.maxResizeWidth > window.innerWidth) {

                        this.maxResizeWidth = window.innerWidth - 20;

                    }

                    Ractive.$win.on("resize." + this.EVENT_NS, function () {

                        if (this.maxResizeWidth > window.innerWidth) {

                            this.maxResizeWidth = window.innerWidth - 20;

                        } else {

                            this.minResizeWidth  = parseFloat($node.attr("data-min-resize-width"))      || 0;
                        }

                    }.bind(this));
                }

                var getRectsForScrollables = function () {

                        var rects = {};

                        if ($scrollingElement) {

                            ($scrollingContent.length ? $scrollingContent : $scrollingElement).each(function (i, el) {

                                rects[i] = el.getBoundingClientRect();
                            });
                        }

                        return rects;
                    },

                    lastRects = getRectsForScrollables(),

                    lastMutation = +new Date(),

                    sizeTimeout = null,
                    transitionTimeout = null,

                    onContentChange = function (delay) {

                        var currentRects = getRectsForScrollables();

                        $.each(currentRects, function (i, rect) {

                            if (rect.width !== lastRects[i].width || rect.height !== lastRects[i].height) {

                                var isMax = this.minmaxButton.classList.contains(this.CLASS.minmaxMax) && !this.minmaxButton.classList.contains(this.CLASS.minmaxMin),
                                    isMin = !isMax;

                                clearTimeout(sizeTimeout);

                                this.set("resizableElementHeight", this.getSettingsHeight());
                                this.set("resizableElementWidth" , this.getSettingsWidth());

                                sizeTimeout = setTimeout(function() {

                                    if (isMin) {

                                        this.beforeHeight = this.getSettingsHeight();
                                        this.beforeWidth  = this.getSettingsWidth();
                                    }

                                    if (!this.wasResized) {

                                        this.minmax(null, isMax, isMin);

                                    } else {

                                        this.wasResized = false;

                                        this.set("resizableElementHeight", this.getSettingsHeight());
                                        this.set("resizableElementWidth" , this.getSettingsWidth());
                                    }

                                }.bind(this), delay || 50);

                                return false;
                            }
                        }.bind(this));

                        lastRects = currentRects;

                    }.bind(this),

                    contentObserver = new MutationObserver(function (mutations) {

                        var currentTime = +new Date();

                        if (currentTime - lastMutation < 50) {

                            lastMutation = currentTime;

                            return;
                        }

                        var m = mutations.length - 1,
                            scrollbarMutations = 0;

                        for (m; m >= 0; m--) {

                            if (mutations[m].target && mutations[m].target.className.match("ps-scrollbar")) {

                                scrollbarMutations++;
                            }
                        }

                        if (mutations.length === scrollbarMutations) {

                            return;
                        }

                        if (this.find("." + this.CLASS.resizerActive)) {

                            return;
                        }

                        if (!this.minmaxing) {

                            this.$resizableBox.css({
                                transition: "none",
                                height: this.getSettingsHeight(),
                                width:  this.getSettingsWidth()
                            });
                        }

                        lastMutation = currentTime;

                        onContentChange();

                    }.bind(this)),

                    initChangeObservers = function () {

                        contentObserver.observe(this.resizableBox, { attributes: true, childList: true, characterData: true, subtree: true });

                    }.bind(this),

                    cancelChangeObservers = function () {

                        contentObserver.disconnect();

                    }.bind(this);

                initChangeObservers();

                this.minmax = this.minmax || function (event, forceMax, forceMin) {

                    if (this.minmaxing && !event) {

                        this.nextRequest = true;

                        return;
                    }

                    contentObserver.disconnect();

                    this.minmaxing = true;

                    if (event) {

                        event.original.srcEvent.stopPropagation();
                        event.original.srcEvent.preventDefault();
                    }

                    //posuvníky je potřeba aktualizovat až na konci
                    this.doNotUpdateScrollbars = true;

                    this.$resizableBox
                        .off("transitionend.resize-" + this.EVENT_NS)
                        .css({
                            transition: "none"
                        });

                    clearTimeout(this.clearAnimStyles);
                    clearTimeout(transitionTimeout);

                    this.resizableBox.style.height = "";
                    this.resizableBox.style.width  = "";

                    var currentHeight = this.get("resizableElementHeight"),
                        currentWidth  = this.get("resizableElementWidth"),

                        maximize = false;

                    //zmenšit na výchozí velikost
                    if (forceMin || (!forceMax && this.minmaxButton.classList.contains(this.CLASS.minmaxMax))) {

                        var sameAsBefore = !forceMin && this.beforeHeight === currentHeight && this.beforeWidth === currentWidth;

                        this.set("resizableElementHeight", sameAsBefore ? this.initHeight : forceMin ? this.userDefHeight: this.beforeHeight);
                        this.set("resizableElementWidth" , sameAsBefore ? this.initWidth  : forceMin ? this.userDefWidth: this.beforeWidth);

                        if (!forceMin) {

                            this.userDefHeight = this.get("resizableElementHeight");
                            this.userDefWidth  = this.get("resizableElementWidth");
                        }

                        this.minmaxButton.classList.remove(this.CLASS.minmaxMax);
                        this.minmaxButton.classList.add(this.CLASS.minmaxMin);

                        //zvětšit na maximální velikost
                    } else {

                        if (!forceMax) {

                            this.beforeHeight = this.get("resizableElementHeight");
                            this.beforeWidth  = this.get("resizableElementWidth");
                        }

                        if (this.maxResizeHeight) {

                            this.set("resizableElementHeight", this.maxResizeHeight);
                        }

                        if (this.maxResizeWidth) {

                            this.set("resizableElementWidth" , this.maxResizeWidth);
                        }

                        this.minmaxButton.classList.add(this.CLASS.minmaxMax);
                        this.minmaxButton.classList.remove(this.CLASS.minmaxMin);

                        maximize = true;
                    }

                    var offset   = this.$self.offset(),
                        selfRect = this.self.getBoundingClientRect(),

                        //zjistit konečné rozměry boxu
                        resizableBoxRect = this.resizableBox.getBoundingClientRect();

                    this.clearAnimStyles = setTimeout(function () {

                        if (this.minResizeWidth) {

                            this.resizableBox.style.minWidth = resizableBoxRect.width >= this.minResizeWidth ? this.minResizeWidth + "px" : resizableBoxRect.width + "px";
                        }

                        if (this.minResizeHeight) {

                            this.resizableBox.style.minHeight = resizableBoxRect.height >= this.minResizeHeight ? this.minResizeHeight + "px" : resizableBoxRect.height + "px";
                        }

                    }.bind(this), 1000);

                    //po zjištění rozměrů po změně velikosti, je potřeba vrátit původní hodnoty kvůli animaci
                    this.set("resizableElementHeight", currentHeight);
                    this.set("resizableElementWidth" , currentWidth);

                    //pokud se velikost nezmění může se funkce ukončit
                    if (resizableBoxRect.width === currentWidth && resizableBoxRect.height === currentHeight) {

                        this.doNotUpdateScrollbars = false;

                        this.minmaxing = false;

                        clearTimeout(this.clearAnimStyles);

                        contentObserver.observe(this.resizableBox, { attributes: true, childList: true, characterData: true, subtree: true });

                        refreshScrollbars();

                        return;
                    }

                    //začátek animace: zafixování současné velikosti
                    this.resizableBox.style.maxWidth  = (forceMin ? this.userDefWidth + "px" : "none");
                    this.resizableBox.style.maxHeight = (forceMin ? this.userDefHeight + "px" : "none");
                    this.resizableBox.style.width  = currentWidth  + "px";
                    this.resizableBox.style.height = currentHeight + "px";

                    if (maximize && this.maxResizeWidth) {

                        this.resizableBox.style.maxWidth  = this.maxResizeWidth  + "px";
                    }

                    if (maximize && this.maxResizeHeight) {

                        this.resizableBox.style.maxHeight = this.maxResizeHeight + "px";
                    }

                    this.resizableBox.style.minWidth  = this.minWidth  + "px";
                    this.resizableBox.style.minHeight = this.minHeight + "px";

                    this.$self.css({
                        transition: ""
                    });

                    transitionTimeout = setTimeout(function() {

                        //spuštění animace: konečná velikost
                        this.resizableBox.style.height = resizableBoxRect.height + "px";
                        this.resizableBox.style.width  = resizableBoxRect.width  + "px";

                        var eventId = +new Date();

                        this.$resizableBox
                            .css({
                                transition: ""
                            })
                            .on("transitionend.resize-" + this.EVENT_NS + "." + eventId, function (e) {

                                if (e.originalEvent.propertyName === "height" || e.originalEvent.propertyName === "width") {

                                    //iOS fix
                                    this.$resizableBox.css({
                                        transition: "none"
                                    });

                                    this.$resizableBox.off("transitionend.resize-" + this.EVENT_NS + "." + eventId);

                                    //přiřadit aktuální vekost do max-rozměrů pro správnou funkčnost roztahování
                                    this.set("resizableElementHeight", this.getSettingsHeight());
                                    this.set("resizableElementWidth" , this.getSettingsWidth());

                                    if (this.minResizeWidth) {

                                        this.resizableBox.style.minWidth = resizableBoxRect.width >= this.minResizeWidth ? this.minResizeWidth + "px" : resizableBoxRect.width + "px";
                                    }

                                    if (this.minResizeHeight) {

                                        this.resizableBox.style.minHeight = resizableBoxRect.height >= this.minResizeHeight ? this.minResizeHeight + "px" : resizableBoxRect.height + "px";
                                    }

                                    clearTimeout(this.clearAnimStyles);

                                    refreshScrollbars();

                                    transitionTimeout = setTimeout(function() {

                                        contentObserver.observe(this.resizableBox, { attributes: true, childList: true, characterData: true, subtree: true });

                                        this.$resizableBox.css({
                                            transition: ""
                                        });

                                        if (this.nextRequest) {

                                            this.nextRequest = false;

                                            onContentChange(100);
                                        }

                                        this.minmaxing = false;

                                    }.bind(this), 0);
                                }
                            }.bind(this));

                        //upravení pozice, pokud se element nevešel na stránku
                        offset = this.minmaxSettingsPosition(offset, 0, 0, offset, selfRect);

                        offset.bottom = offset.top  + selfRect.height;
                        offset.right  = offset.left + selfRect.width;

                        this.$self
                            .offset(offset)
                            .data("lastOffset.PageElementSettings", offset);

                        this.doNotUpdateScrollbars = false;

                    }.bind(this), 20);
                };

                $scrollingElement
                    .css({
                        position: "relative"
                    })
                    .perfectScrollbar();

                this.observe("resizableElementHeight", function (height) {

                    if (height < this.minHeight) {

                        height = this.minHeight;

                        this.set("resizableElementHeight", this.minHeight);
                    }

                    if (this.maxResizeHeight && height > this.maxResizeHeight) {

                        height = this.maxResizeHeight;

                        this.set("resizableElementHeight", this.maxResizeHeight);
                    }

                    this.resizableBox.style.maxHeight = height + "px";

                    if (this.minResizeHeight) {

                        this.resizableBox.style.minHeight = height >= this.minResizeHeight ? this.minResizeHeight + "px" : height + "px";
                    }

                    if (!this.doNotUpdateScrollbars) {

                        refreshScrollbars();
                    }

                }, {init: false, context: this});

                this.observe("resizableElementWidth", function (width) {

                    if (width < this.minWidth) {

                        width = this.minWidth;

                        this.set("resizableElementWidth", this.minWidth);
                    }

                    if (this.maxResizeWidth && width > this.maxResizeWidth) {

                        width = this.maxResizeWidth;

                        this.set("resizableElementWidth", this.maxResizeWidth);
                    }

                    this.resizableBox.style.maxWidth = width + "px";

                    if (this.minResizeWidth) {

                        this.resizableBox.style.minWidth = width >= this.minResizeWidth ? this.minResizeWidth + "px" : width + "px";
                    }

                    if (!this.doNotUpdateScrollbars) {

                        refreshScrollbars();
                    }

                }, {init: false, context: this});

                return {
                    teardown: function () {

                        cancelChangeObservers();

                        clearTimeout(sizeTimeout);
                        clearTimeout(transitionTimeout);
                        clearTimeout(refreshThrottle);

                        $scrollingElement
                            .css({
                                position: ""
                            })
                            .perfectScrollbar("destroy");

                        Ractive.$win.off("resize." + this.EVENT_NS);

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

            this.EVENT_NS = "PageElementSettings-" + (++instanceCounter);

            if (on.client) {

                Ractive.$win = Ractive.$win || $(window);
            }

            this.minmaxing = true;
        },

        onrender: function () {

            if (on.client) {

                this.self  = this.find("." + this.CLASS.self);
                this.$self = $(this.self);

                this.$self.css({
                    transition: "none"
                });

                //přesunout element do #page kvůli správnému z-indexu
                //parent === obalovací element pro transition
                this.$self.parent().prependTo("#page");

                this.resizableElement  = this.find("." + this.CLASS.content);
                this.$resizableElement = $(this.resizableElement);

                //element, podle kterého se nastaví pozice nastavení (aktivační tlačítko)
                this.positionElement  = this.get("positionElement");
                this.$positionElement = $(this.positionElement);

                this.setPosition();

                Ractive.$win.on("resize." + this.EVENT_NS, this.setPosition.bind(this, false, null, true));
            }
        },

        oncomplete: function () {

            if (on.client) {

                this.set("resizableElementHeight", this.getSettingsHeight());
                this.set("resizableElementWidth" , this.getSettingsWidth());

                this.userDefHeight = this.get("resizableElementHeight");
                this.userDefWidth = this.get("resizableElementWidth");

                this.$self.css({
                    transition: ""
                });

                this.minmaxing = false;
            }
        },

        onteardown: function () {

            Ractive.$win.off("." + this.EVENT_NS);
        },

        activateMover: function (e) {

            var eventData = U.eventData(e),

                lastY = eventData.pageY,
                lastX = eventData.pageX;

            if (eventData.pointers > 1) {

                return;
            }

            this.$self.css({
                transition: "none"
            });

            Ractive.$win
                .off("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS)
                .on( "mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS, function (e) {

                    var eventData = U.eventData(e);

                    if (eventData.pointers > 1) {

                        return;
                    }

                    var offset = this.$self.offset(),
                        newOffset = {};

                    newOffset.top  = offset.top  + (eventData.pageY - lastY);
                    newOffset.left = offset.left + (eventData.pageX - lastX);

                    newOffset = this.minmaxSettingsPosition(newOffset, eventData.pageX - lastX, eventData.pageY - lastY, offset);

                    this.$self.offset(newOffset);

                    lastX = eventData.pageX;
                    lastY = eventData.pageY;

                    e.preventDefault();
                    return false;

                }.bind(this))
                .one("mouseup." + this.EVENT_NS + " touchend." + this.EVENT_NS, function (e) {

                    Ractive.$win.off("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS);

                    var currentOffset = this.$self.offset(),
                        selfRect      = this.self.getBoundingClientRect();

                    currentOffset.right  = currentOffset.left + selfRect.width;
                    currentOffset.bottom = currentOffset.top  + selfRect.height;
                    currentOffset.changedByUser = true;

                    //uložení aktuálního offsetu pro použití v setPosition
                    this.$self
                        .offset(currentOffset)
                        .data("lastOffset.PageElementSettings", currentOffset)
                        .css({
                            transition: ""
                        });

                    e.preventDefault();
                    return false;

                }.bind(this));

            eventData.preventDefault();
            return false;
        },

        minmaxSettingsPosition: function (newOffset, changeX, changeY, currentOffset, currentSelfRect) {

            var offset   = currentOffset   || this.$self.offset(),
                selfRect = currentSelfRect || this.self.getBoundingClientRect();

            //element by přesahoval pravý okraj stránky
            if (offset.left + selfRect.width + changeX >= document.documentElement.offsetWidth) {

                newOffset.left = document.documentElement.offsetWidth - selfRect.width;

                //element by přesahoval levý okraj stránky
            } else if (offset.left + changeX < 0) {

                newOffset.left = 0;
            }

            //element by přesahoval dolní okraj stránky
            if (offset.top + selfRect.height + changeY >= document.documentElement.offsetHeight) {

                newOffset.top = document.documentElement.offsetHeight - selfRect.height;

                //element by přesahoval horní okraj stránky
            } else if (offset.top + changeY < 0) {

                newOffset.top = 0;
            }

            return newOffset;
        },

        activateResizer: function (e, position) {

            var eventData = U.eventData(e),

                lastY = eventData.clientY,
                lastX = eventData.clientX,
                
                resized = false;

            if (eventData.pointers > 1) {

                return;
            }

            this.$self.css({
                transition: "none"
            });

            eventData.target.classList.add(this.CLASS.resizerActive);

            Ractive.$win
                .off("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS)
                .on( "mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS, function (e) {

                    var eventData = U.eventData(e);

                    if (eventData.pointers > 1) {

                        return;
                    }

                    this.minmaxButton.classList.remove(this.CLASS.minmaxMax);

                    this.$resizableBox.css({
                        transition: "none",
                        width: "",
                        height: ""
                    });

                    if (position.match(/bottom|top/)) {

                        var diffY = position.match(/bottom/) ? eventData.clientY - lastY : lastY - eventData.clientY;

                        this.set("resizableElementHeight", this.getSettingsHeight() + diffY);
                    }

                    if (position.match(/left|right/)) {

                        var diffX = position.match(/right/) ? eventData.clientX - lastX : lastX - eventData.clientX;

                        this.set("resizableElementWidth" , this.getSettingsWidth()  + diffX);
                    }

                    this.setPosition(true, position);

                    lastY = eventData.clientY;
                    lastX = eventData.clientX;

                    resized = true;
                
                    e.preventDefault();
                    return false;
                }.bind(this))
                .one("mouseup." + this.EVENT_NS + " touchend." + this.EVENT_NS, function (e) {

                    this.wasResized = resized;

                    eventData.target.classList.remove(this.CLASS.resizerActive);

                    if (resized) {

//                        if (position.match(/bottom|top/)) {

                            this.set("resizableElementHeight", this.getSettingsHeight());

                            this.userDefHeight = this.get("resizableElementHeight");
//                        }

//                        if (position.match(/left|right/)) {

                            this.set("resizableElementWidth", this.getSettingsWidth());

                            this.userDefWidth = this.get("resizableElementWidth");
//                        }

                        this.setPosition(true, position);

                        setTimeout(function() {

                            this.wasResized = false;

                        }.bind(this), 0);
                    }

                    this.$self.css({
                        transition: ""
                    });

                    Ractive.$win.off("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS);

                    e.preventDefault();
                    return false;
                }.bind(this));

            eventData.preventDefault();
            return false;
        },

        getSettingsHeight: function () {

            return this.resizableElement.getBoundingClientRect().height;
        },

        getSettingsWidth: function () {

            return this.resizableElement.getBoundingClientRect().width;
        },

        setPosition: function (savedPosition, resizerPosition, checkDocOverflow) {

            this.savedPosition = this.savedPosition || {};

            var selfRect   = this.self.getBoundingClientRect(),
                lastOffset = this.$self.data("lastOffset.PageElementSettings") || {},

                buttonOffset = this.$positionElement.offset(),
                buttonRect   = this.positionElement.getBoundingClientRect(),

                finalOffset = buttonOffset,

                right       = buttonRect.right  + selfRect.width  + this.OPTIONS.SETTINGS_OFFSET,
                left        = buttonRect.left   - selfRect.width  - this.OPTIONS.SETTINGS_OFFSET,
                top         = buttonRect.top    - selfRect.height - this.OPTIONS.SETTINGS_OFFSET,
                bottom      = buttonRect.bottom + selfRect.height + this.OPTIONS.SETTINGS_OFFSET,
                centerLeft  = buttonRect.left   + (buttonRect.width / 2) - (selfRect.width / 2),
                centerRight = buttonRect.left   + (buttonRect.width / 2) + (selfRect.width / 2),

                viewportWidth = U.viewportWidth();

            //Pokud se kontroluje velikost stránky (= v případě resize události, pokud uživatel element přesunul)
            //a element není mimo stránku, pozice se nezmění
            if (checkDocOverflow && lastOffset.changedByUser && !this.overflowsDoc(lastOffset)) {

                return;

            } else if (checkDocOverflow) {

                //pokud se pozice změní vrátí se zpět automatcké upravování pozice
                finalOffset.changedByUser = false;
            }

            //element bude po změně pozice pod horním okrajem okna nebo byl při inicializaci takto nastaven,
            //protože by jinak při zvětšování mohlo dojít k přeskočení elementu
            if ((!savedPosition && top >= 0) || (savedPosition && this.savedPosition.v === "top")) {

                finalOffset.top -= selfRect.height + this.OPTIONS.SETTINGS_OFFSET;

                this.savedPosition.v = "top";

            } else {

                finalOffset.top += buttonRect.height + this.OPTIONS.SETTINGS_OFFSET;

                this.savedPosition.v = "bottom";
            }

            //pokud je obrazovka menší jak 768 (včetně), element se zarovná do středu
            if ((!savedPosition && (viewportWidth <= 768 && centerLeft >= 0 && centerRight <= viewportWidth)) || (savedPosition && this.savedPosition.h === "center")) {

                finalOffset.left -= (selfRect.width / 2) - (buttonRect.width / 2);

                finalOffset.top += this.savedPosition.v === "top" ? this.OPTIONS.SETTINGS_OFFSET : this.OPTIONS.SETTINGS_OFFSET * -1;

                this.savedPosition.h = "center";

                //element bude po změně pozice před pravým okrajem okna nebo byl při inicializaci takto nastaven,
                //protože by jinak při zvětšování mohlo dojít k přeskočení elementu
            } else if ((!savedPosition && (right <= viewportWidth || left < 0)) || (savedPosition && this.savedPosition.h === "right")) {

                finalOffset.left += buttonRect.width + this.OPTIONS.SETTINGS_OFFSET;

                this.savedPosition.h = "right";

            } else {

                finalOffset.left -= selfRect.width + this.OPTIONS.SETTINGS_OFFSET;

                this.savedPosition.h = "left";
            }

            //úprava offsetu, pokud uživatel změní velikost elementu (je potřeba změnit css top a left)
            if (resizerPosition) {

                var diffX,
                    diffY;

                if (resizerPosition.match(/right/) || !resizerPosition.match(/left/)) {

                    diffX = lastOffset.left - finalOffset.left;

                    finalOffset.left += diffX;

                } else {

                    diffX = lastOffset.right - (finalOffset.left + selfRect.width);

                    finalOffset.left += diffX;
                }

                if (resizerPosition.match(/bottom/) || !resizerPosition.match(/top/)) {

                    diffY = lastOffset.top - finalOffset.top;

                    finalOffset.top += diffY;

                } else {

                    diffY = lastOffset.bottom - (finalOffset.top + selfRect.height);

                    finalOffset.top += diffY;
                }
            }

            finalOffset.top    = Math.max(0, finalOffset.top);
            finalOffset.left   = Math.max(0, finalOffset.left);
            finalOffset.right  = finalOffset.left + selfRect.width;
            finalOffset.bottom = finalOffset.top  + selfRect.height;

            finalOffset.changedByUser = finalOffset.changedByUser === undefined ? lastOffset.changedByUser : finalOffset.changedByUser;

            this.$self
                .offset(finalOffset)
                .data("lastOffset.PageElementSettings", finalOffset);
        },

        overflowsDoc: function (offsetWithBottomAndRight) {

            return document.documentElement.offsetWidth < offsetWithBottomAndRight.right || document.documentElement.offsetHeight < offsetWithBottomAndRight.bottom;
        }
    });

}));

