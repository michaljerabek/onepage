/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            U = require("./../../../../libs/U"),
            on = require("./../../../../../helpers/on"),

            components = {
                ColorPicker: require("./../../../../libs/Components/ColorPicker")
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

            resizer: "E_PageElementSettings--resizer",
            resizerActive: "E_PageElementSettings--resizer__active"
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

                    refreshThrottle = null,
                    refreshScrollbars = function () {

                        clearTimeout(refreshThrottle);

                        refreshThrottle = setTimeout(function() {

                            $scrollingElement.perfectScrollbar("update");

                        }, 100);
                    };

                this.minHeight = parseFloat(this.$resizableElement.css("min-height")) || 0;
                this.minWidth  = parseFloat(this.$resizableElement.css("min-width"))  || 0;

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

                    node.style.maxHeight = height + "px";

                    refreshScrollbars();

                }, {init: false, context: this});

                this.observe("resizableElementWidth", function (width) {

                    if (width < this.minWidth) {

                        width = this.minWidth;

                        this.set("resizableElementWidth", this.minWidth);
                    }

                    node.style.maxWidth = width + "px";

                    refreshScrollbars();

                }, {init: false, context: this});

                return {
                    teardown: function () {

                        clearTimeout(refreshThrottle);

                        $scrollingElement
                            .css({
                                position: ""
                            })
                            .perfectScrollbar("destroy");

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
        },

        onrender: function () {

            if (on.client) {

                this.self  = this.find("." + this.CLASS.self);
                this.$self = $(this.self);

                //přesunout element do <body/> kvůli správnému z-indexu
                this.$self.appendTo("body");

                this.resizableElement  = this.find("." + this.CLASS.wrapper);
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

                this.setPosition();

                this.set("resizableElementHeight", this.getSettingsHeight());
                this.set("resizableElementWidth", this.getSettingsWidth());
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

            Ractive.$win
                .off("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS)
                .on( "mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS, function (e) {

                    var eventData = U.eventData(e);

                    if (eventData.pointers > 1) {

                        return;
                    }

                    var selfRect = this.self.getBoundingClientRect(),
                        offset = this.$self.offset(),

                        newOffset = {};

                        newOffset.top  = offset.top  + (eventData.pageY - lastY);
                        newOffset.left = offset.left + (eventData.pageX - lastX);

                    //element by přesahoval pravý okraj stránky
                    if (offset.left + selfRect.width + (eventData.pageX - lastX) >= document.documentElement.offsetWidth) {

                        newOffset.left = document.documentElement.offsetWidth - selfRect.width;

                    //element by přesahoval levý okraj stránky
                    } else if (offset.left + (eventData.pageX - lastX) < 0) {

                        newOffset.left = 0;
                    }

                    //element by přesahoval dolní okraj stránky
                    if (offset.top + selfRect.height + (eventData.pageY - lastY) >= document.documentElement.offsetHeight) {

                        newOffset.top = document.documentElement.offsetHeight - selfRect.height;

                    //element by přesahoval horní okraj stránky
                    } else if (offset.top + (eventData.pageY - lastY) < 0) {

                        newOffset.top = 0;
                    }

                    this.$self.offset(newOffset);

                    lastX = eventData.pageX;
                    lastY = eventData.pageY;

                    e.preventDefault();
                    return false;
                }.bind(this))
                .one("mouseup." + this.EVENT_NS + " touchend." + this.EVENT_NS, function (e) {

                    Ractive.$win.off("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS);

                    var currentOffset = this.$self.offset(),
                        selfRect = this.self.getBoundingClientRect();

                    currentOffset.right  = currentOffset.left + selfRect.width;
                    currentOffset.bottom = currentOffset.top  + selfRect.height;
                    currentOffset.changedByUser = true;

                    //uložení aktuálního offsetu pro použití v setPosition
                    this.$self.data("lastOffset.PageElementSettings", currentOffset);

                    e.preventDefault();
                    return false;
                }.bind(this));

            eventData.preventDefault();
            return false;
        },

        activateResizer: function (e, position) {

            var eventData = U.eventData(e),

                lastY = eventData.clientY,
                lastX = eventData.clientX;

            if (eventData.pointers > 1) {

                return;
            }

            eventData.target.classList.add(this.CLASS.resizerActive);

            Ractive.$win
                .off("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS)
                .on( "mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS, function (e) {

                    var eventData = U.eventData(e);

                    if (eventData.pointers > 1) {

                        return;
                    }

                    if (position.match(/bottom|top/)) {

                        var diffY = position.match(/bottom/) ? eventData.clientY - lastY : lastY - eventData.clientY;

                        this.set("resizableElementHeight", this.getSettingsHeight() + diffY);
                    }

                    if (position.match(/left|right/)) {

                        var diffX = position.match(/right/) ? eventData.clientX - lastX : lastX - eventData.clientX;

                        this.set("resizableElementWidth", this.getSettingsWidth() + diffX);
                    }

                    this.setPosition(true, position);

                    lastY = eventData.clientY;
                    lastX = eventData.clientX;

                    e.preventDefault();
                    return false;
                }.bind(this))
                .one("mouseup." + this.EVENT_NS + " touchend." + this.EVENT_NS, function (e) {

                    eventData.target.classList.remove(this.CLASS.resizerActive);

                    if (position.match(/bottom|top/)) {

                        this.set("resizableElementHeight", this.getSettingsHeight());
                    }

                    if (position.match(/left|right/)) {

                        this.set("resizableElementWidth", this.getSettingsWidth());
                    }

                    this.setPosition(true, position);

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

            var selfRect = this.self.getBoundingClientRect(),
                lastOffset = this.$self.data("lastOffset.PageElementSettings") || {},

                buttonOffset = this.$positionElement.offset(),
                buttonRect = this.positionElement.getBoundingClientRect(),

                finalOffset = buttonOffset,

                right       = buttonRect.right  + selfRect.width,
                left        = buttonRect.left   - selfRect.width,
                top         = buttonRect.top    - selfRect.height,
                bottom      = buttonRect.bottom + selfRect.height,
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

                finalOffset.top -= selfRect.height;

                this.savedPosition.v = "top";

            } else {

                finalOffset.top += buttonRect.height;

                this.savedPosition.v = "bottom";
            }

            //pokud je obrazovka menší jak 768 (včetně), element se zarovná do středu
            if ((!savedPosition && (viewportWidth <= 768 && centerLeft >= 0 && centerRight <= viewportWidth)) || (savedPosition && this.savedPosition.h === "center")) {

                finalOffset.left -= (selfRect.width / 2) - (buttonRect.width / 2);

                this.savedPosition.h = "center";

            //element bude po změně pozice před pravým okrajem okna nebo byl při inicializaci takto nastaven,
            //protože by jinak při zvětšování mohlo dojít k přeskočení elementu
            } else if ((!savedPosition && (right <= viewportWidth || left < 0)) || (savedPosition && this.savedPosition.h === "right")) {

                finalOffset.left += buttonRect.width;

                this.savedPosition.h = "right";

            } else {

                finalOffset.left -= selfRect.width;

                this.savedPosition.h = "left";
            }

            //úprava offsetu, pokud uživatel změní velikost elementu (je potřeba změnit css top a left)
            if (resizerPosition) {

                var diffX,
                    diffY;

                if (resizerPosition.match(/right/)) {

                    diffX = lastOffset.left - finalOffset.left;

                    finalOffset.left += diffX;

                } else {

                    diffX = lastOffset.right - (finalOffset.left + selfRect.width);

                    finalOffset.left += diffX;
                }

                if (resizerPosition.match(/bottom/)) {

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

