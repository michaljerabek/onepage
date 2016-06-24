/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),

            U = require("./../../../../libs/U"),
            on = require("./../../../../../helpers/on"),

            components = {
                IconBrowser: require("./../../../../libs/Components/FileBrowser/IconBrowser"),
                ImageBrowser: require("./../../../../libs/Components/FileBrowser/ImageBrowser"),
                ColorPicker: require("./../../../../libs/Components/ColorPicker"),
                ColorPickerPalette: require("./../../../../libs/Components/ColorPicker/Components/ColorPickerPalette")
            };

        module.exports = factory(
            Ractive,
            U,
            components,
            require("./index.tpl"),
            on
        );

    } else {

        root.PageElementSettings = factory(
            root.Ractive,
            root.U,
            "",
            {client: true}
        );
    }

}(this, function (Ractive, U, components, template, on) {

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
        },

        partials: {
            Tabs: require("./tabs.tpl")
        },

        decorators: {

            ResizableBox: require("./../../../../libs/Decorators/ResizableBox")
        },

        data: function () {

            return {
            };
        },

        superOnconfig: function () {

            this.EVENT_NS = "PageElementSettings-" + (++instanceCounter);

            if (on.client) {

                Ractive.$win = Ractive.$win || $(window);
            }

            this.PageSection = this.getPageSection();

            this.onresizableboxend = function (offset, selfRect) {

                //upravení pozice, pokud se element nevešel na stránku
                offset = this.minmaxSettingsPosition(offset, 0, 0, offset, selfRect);

                offset.bottom = offset.top  + selfRect.height;
                offset.right  = offset.left + selfRect.width;

                this.$self
                    .offset(offset)
                    .data("lastOffset.PageElementSettings", offset);
            };

            this.onresizableboxresize = function (position) {

                this.setPosition(true, position);
            };
        },

        superOnrender: function () {

            if (on.client) {

                this.self  = this.find("." + this.CLASS.self);
                this.$self = $(this.self);

                this.$self.css({
                    transition: "none"
                });

                //přesunout element do #page kvůli správnému z-indexu
                //parent === obalovací element pro transition
                this.$self.parent().prependTo("#page");

                //element, podle kterého se nastaví pozice nastavení (aktivační tlačítko)
                this.positionElement  = this.get("positionElement");
                this.$positionElement = $(this.positionElement);

                this.setPosition();

                Ractive.$win.on("resize." + this.EVENT_NS, this.setPosition.bind(this, false, null, true));
            }
        },

        superOncomplete: function () {

            if (on.client) {

                this.$self.css({
                    transition: ""
                });
            }

            this.set("completed", true);
        },

        superOnteardown: function () {

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

