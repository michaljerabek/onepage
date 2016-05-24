/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

var FixedElement = require("./../../libs/FixedElement"),
    U = require("./../../libs/U"),
    EventEmitter = require("./../../libs/EventEmitter")();

var instaceCounter = 0,

    CLASS = {
        self: "E_PageMenu",

        cssFixed: "E_PageMenu__css-fixed",
        hidden: "E_PageMenu__hidden",
        visible: "E_PageMenu__visible",

        showPage: "E_PageMenu--show-page",
        showPageActive: "E_PageMenu__show-page",

        showContent: "E_PageMenu--item__show-content",
        unsavedChanges: "E_PageMenu--save__unsaved",

        fixedTop: "E_PageMenu__fixed-top",
        fixedBottom: "E_PageMenu__fixed-bottom",

        item: "E_PageMenu--item",
        content: "E_PageMenu--content",
        contentWrapper: "E_PageMenu--content-wrapper",

        resizer: "E_PageMenu--resizer",
        resizerActive: "E_PageMenu--resizer__active"
    },

    draggableActiveTimeout = null,
    resizeTimeout = null,
    ensureVisibilityTimeout = null,
    
    shouldBeHidden = false,
    shouldBeHiddenBecauseHasSettings = false,

    //sníží (nebo vrátí zpět) opacity menu, aby bylo vidět stránku
    toggleShowPage = function (e) {
        
        this.$pageMenu.toggleClass(CLASS.showPageActive, e.original.type.match(/enter|start|over/));
        
        e.original.preventDefault();
        e.original.stopPropagation();
    },
    
    //nastaví maximální velikost položky podle velikosti okna (položka má v CSS 100vh, ale např. na iPadu může být větší)
    setMaxHeight = function () {

        this.$pageMenu
            .find("." + CLASS.item + ", ." + CLASS.contentWrapper)
            .css({
                maxHeight: window.innerHeight
            });
    },

    getZoom = function () {

        return document.documentElement.clientWidth / window.innerWidth;
    },

    handleTouchstart = function (e) {

        //použít FixedElement, pokud se jedná o dotykové zařízení
        if (!this.pageMenuLeft && !this.pageMenuRight) {

            this.$pageMenu
                .removeClass(CLASS.cssFixed)
                .css({
                    position: "absolute"
                });

            this.pageMenuLeft  = new FixedElement(this.$pageMenu[0], { zoom: false });
            this.pageMenuRight = new FixedElement(this.$pageMenu[1], { zoom: false });
        }

        if (this.hidden) {

            return;
        }

        this.touch.touches = e.originalEvent.touches.length > this.touch.touches ? e.originalEvent.touches.length : this.touch.touches;
        this.touch.zoom = getZoom();

        //gesto: 3 prsty nohoru/dolu -> změna pozice menu
        if (e.originalEvent.touches.length === 3) {

            this.touch.startX = e.originalEvent.touches[0].clientX;
            this.touch.startY = e.originalEvent.touches[0].clientY;
        }
    },

    handleTouchmove = function (e) {

        if (!this.hidden && !this.touch.switched && e.originalEvent.touches[2]) {

            e.preventDefault();

            if (Math.abs(this.touch.startY - e.originalEvent.touches[0].clientY) > 40 / this.touch.zoom) {

                this.touch.switched = true;

                if (this.touch.startY - e.originalEvent.touches[0].clientY > 0) {

                    this.changePosition("top");

                } else {

                    this.changePosition("bottom");
                }
            }
        }
    },

    handleTouchend = function () {

        clearTimeout(this.touch.touchesTimeout);

        this.touch.touchesTimeout = setTimeout(function () {

            //skrýt/zobrazit menu při zoomu
            if (this.touch.touches === 2) {

                this[getZoom() > 1 ? "hide": "show"]();
            }

            this.touch.touches = 0;
            this.touch.switched = false;

        }.bind(this), 75);
    },

    handleWinResize = function () {

        clearTimeout(resizeTimeout);

        //změnit velikost položky, pokud se změní velikost okna a stránka není přiblížena
        if (getZoom() <= 1) {

            resizeTimeout = setTimeout(setMaxHeight.bind(this), 50);
        }

        //skrýt/zobrazit menu při zoomu
        this[getZoom() > 1 ? "hide": "show"]();
    },

    //viz ensureVisibility
    checkIfShoudBeHidden = function() {

        shouldBeHidden = this.Page.get("sortableActive") && !this.Page.get("draggableActive");

        shouldBeHiddenBecauseHasSettings = false;

        if (!shouldBeHidden) {

            this.Page.forEachPageSection(function () {

                var hasSettings = this.get("hasSettings");

                if (hasSettings || this.get("hasOutline")) {

                    shouldBeHidden = true;

                    shouldBeHiddenBecauseHasSettings = hasSettings;

                    return false;
                }
            });
        }
    },

    //zajistí skrytí/zobrazení menu
    //menu se skryje pokud uživatel přeřazuje sekce, edituje PageElement nebo má otevřené nastavení sekce
    ensureVisibility = function () {

        clearTimeout(ensureVisibilityTimeout);

        ensureVisibilityTimeout = setTimeout(function () {

            checkIfShoudBeHidden.call(this);

            this[shouldBeHidden ? "hide": "show"](shouldBeHiddenBecauseHasSettings);

        }.bind(this), 250);
    },

    activateResizer = function (e) {

        var eventData = U.eventData(e);

        if (eventData.pointers > 1) {

            return;
        }

        var $item = $(eventData.target).closest("." + CLASS.item),
            $contentWrapper = $item.find("." + CLASS.contentWrapper),

            initX = eventData.clientX,
            initWidth = $item.width();

        eventData.target.classList.add(CLASS.resizerActive);

        $item.css({
            transition: "none"
        });

        this.$win
            .off("mousemove.resizer-" + this.EVENT_NS + " touchmove.resizer-" + this.EVENT_NS)
            .on("mousemove.resizer-" + this.EVENT_NS + " touchmove.resizer-" + this.EVENT_NS, function (e) {

                var eventData = U.eventData(e);

                if (eventData.pointers > 1) {

                    return;
                }

                $item.css({
                    width: initWidth + eventData.clientX - initX
                });

                $contentWrapper.css({
                    width: initWidth + eventData.clientX - initX
                });

                e.preventDefault();
                return false;

            }.bind(this))
            .one("mouseup.resizer-" + this.EVENT_NS + " touchend.resizer-" + this.EVENT_NS, function (e) {

                eventData.target.classList.remove(CLASS.resizerActive);

                $item.css({
                        width: $item.width(),

                        transition: ""
                    })
                    .perfectScrollbar("update");

                $contentWrapper.css({
                    width: $item.width(),

                    transition: ""
                });

                this.$win.off("mousemove.resizer-" + this.EVENT_NS + " touchmove.resizer-" + this.EVENT_NS);

                EventEmitter.trigger("change.ResizableBox");

                e.preventDefault();
                return false;

            }.bind(this));

        eventData.preventDefault();
        return false;
    },

    //odstraní scrollbar při zavření a odstraní uživatelem nastavenou velikost
    resetCurrentItem = function () {

        var $openedItem = this.$pageMenu.find("." + CLASS.showContent),
            $openedContentWrapper = $openedItem.find("." + CLASS.contentWrapper),

            cancelContentObserver = $openedContentWrapper.data("contentObserver." + this.EVENT_NS);

        if (cancelContentObserver) {

            cancelContentObserver();

            $openedContentWrapper.data("contentObserver." + this.EVENT_NS, null);
        }

        $openedContentWrapper.perfectScrollbar("destroy");

        $openedItem.on("transitionend." + this.EVENT_NS, function (e) {

            //odstranit velikost až poté, co se skryje obsah
            if (e.originalEvent.propertyName === "visibility" && e.target.classList.contains(CLASS.content)) {

                $openedItem
                    .off("transitionend." + this.EVENT_NS)
                    .css({
                        width: ""
                    });

                $openedContentWrapper.css({
                    width: ""
                });
            }
        });
    },

    updateScrollbar = function ($contentWrapper, contentObserverTimeout) {

        var wrapperRect = $contentWrapper[0].getBoundingClientRect(),
            contentRect = $contentWrapper[0].firstChild.getBoundingClientRect(),

            wrapperPadding = parseFloat($contentWrapper.css("padding-bottom")) + parseFloat($contentWrapper.css("padding-top"));

        if (wrapperRect.bottom - wrapperPadding > contentRect.bottom) {

            $contentWrapper
                .stop()
                .animate({
                    scrollTop: $contentWrapper[0].firstChild.offsetHeight + wrapperPadding - $contentWrapper[0].offsetHeight
                }, {
                    duration: 200,

                    progress: function () {
                        clearTimeout(contentObserverTimeout);
                    },

                    complete: function () {
                        $contentWrapper.perfectScrollbar("update");
                    }
                });

        } else if (wrapperRect.bottom - wrapperPadding < contentRect.bottom) {

            $contentWrapper.stop().perfectScrollbar("update");
        }
    },

    addScrollbar = function () {

        var $openedContentWrapper = this.$pageMenu.find("." + CLASS.showContent + " ." + CLASS.contentWrapper);

        $openedContentWrapper.perfectScrollbar({
            swipePropagation: false, //Odstranit? Při přiblízení nelze posouvat stránkou.,
            wheelPropagation: false
        });

        if (!$openedContentWrapper.data("contentObserver." + this.EVENT_NS)) {

            var contentObserverTimeout = null,

                contentObserver = new MutationObserver(function () {

                    clearTimeout(contentObserverTimeout);

                    contentObserverTimeout = setTimeout(updateScrollbar.bind(this, $openedContentWrapper, contentObserverTimeout), 50);
                }),

                cancelContentObserver = function () {

                    clearTimeout(contentObserverTimeout);

                    contentObserver.disconnect();

                    $openedContentWrapper.stop();
                };

            contentObserver.observe($openedContentWrapper[0], { attributes: true, childList: true, characterData: true, subtree: true });

            $openedContentWrapper.data("contentObserver." + this.EVENT_NS, cancelContentObserver);
        }
    },

    init = function ($selectable) {

        this.touch = {};

        this.init$selectable = $selectable;

        this.$pageMenu = $($selectable);

        this.$pageMenu
            .addClass(CLASS.cssFixed + " " + CLASS.visible);

        this.changePosition("top");

        this.$win
            .on("resize."     + this.EVENT_NS, handleWinResize.bind(this))
            .on("touchstart." + this.EVENT_NS, handleTouchstart.bind(this))
            .on("touchmove."  + this.EVENT_NS, handleTouchmove.bind(this))
            .on("touchend."   + this.EVENT_NS, handleTouchend.bind(this));

        this.Page.on("*.showPage showPage", toggleShowPage.bind(this));
        
        //skryje menu s výběrem sekcí, pokud uživatel přetáhně nějakou sekci do stránky
        this.draggableActiveObserver = this.Page.observe("draggableActive", function (state) {

            clearTimeout(draggableActiveTimeout);

            if (state) {

                draggableActiveTimeout = setTimeout(this.set.bind(this, "openPageMenu", null), 100);
            }
        }, {init: false});

        this.openPageMenuObserver = this.Page.observe("openPageMenu", function (type) {

            if (type) {

                //při otevření nasavit maximální výšku podle okna 
                setMaxHeight.call(this);

            } else {

                //při zavření ostranit uživatelem nastavenou velkost a odstranit scrollbar
                resetCurrentItem.call(this);

                //při přiblížení sktrýt
                if (getZoom() > 1) {

                    this.hide();
                }
            }

        }, {init: false, context: this});

        //přidá scrollbar při otevření položky
        this.openPageMenuObserverDefer = this.Page.observe("openPageMenu", function (type) {

            if (type) {

                addScrollbar.call(this);
            }

        }, {init: false, context: this, defer: true});

        //skrýt/zobrazit při úpravě stránky
        this.sortableActiveObserver = this.Page.observe("sortableActive", ensureVisibility.bind(this), {init: false});
        this.Page.on("*.sectionHasOutline", ensureVisibility.bind(this));
        this.Page.on("*.openPageSectionSettings *.closeThisSettings", ensureVisibility.bind(this));

        this.Page.on("activateResizer", activateResizer.bind(this));

        //změna pozice menu (tlačítkem) - nahoře/dole
        this.Page.on("switchPosition", function (event, position) {

            event.original.srcEvent.stopPropagation();
            event.original.srcEvent.preventDefault();

            this.changePosition(position);

        }.bind(this));
    },

    PageMenu = function PageMenu($selectable, pageComponent) {

        this.Page = pageComponent;

        this.EVENT_NS = "PageMenu-" + (instaceCounter++);
        this.$win = $(window);

        init.call(this, $selectable);
    };

PageMenu.prototype.destroy = function () {

    clearTimeout(draggableActiveTimeout);

    if (this.pageMenuLeft) {

        this.pageMenuLeft.destroy();
    }

    if (this.pageMenuRight) {

        this.pageMenuRight.destroy();
    }

    this.openPageMenuObserver.cancel();
    this.openPageMenuObserverDefer.cancel();
    this.sortableActiveObserver.cancel();
    this.draggableActiveObserver.cancel();

    this.Page.off("*.sectionHasOutline");
    this.Page.off("*.openPageSectionSettings");
    this.Page.off("addingSectionCanceled");
    this.Page.off("switchPosition");
    this.Page.off("*.showPage");

    this.$pageMenu
        .find("." + CLASS.contentWrapper)
        .perfectScrollbar("destroy")
        .each(function (i, wrapper) {

            var cancelContentObserver = $(wrapper).data("contentObserver." + this.EVENT_NS);

            if (cancelContentObserver) {

                cancelContentObserver();
            }
        }.bind(this));

    this.pageMenuLeft  = null;
    this.pageMenuRight = null;
    this.$pageMenu = null;
    this.touch = null;

    this.$win
        .off("." + this.EVENT_NS)
        .off(".resizer-" + this.EVENT_NS);
    
    return this;
};

//změní pozici menu -> nahoře/dole
PageMenu.prototype.changePosition = function (position) {

    this.touch.lastPositionY = this.touch.positionY;

    this.touch.positionY = position;

    if (this.touch.positionY === this.touch.lastPositionY) {

        return this;
    }

    var $items = this.$pageMenu.find("." + CLASS.item),
        savedDisplay;

    //pokud není použit FixedElement (= desktop), je potřeba zajistit spuštění animací (display: none)
    if (!this.pageMenuLeft && !this.pageMenuRight) {

        savedDisplay = this.$pageMenu.css("display");

        this.$pageMenu.css({
            display: "none"
        });

        $items.css({
            transition: "none"
        });
    }

    this.$pageMenu[this.touch.positionY === "bottom" ? "removeClass" : "addClass"](CLASS.fixedTop);
    this.$pageMenu[this.touch.positionY === "bottom" ? "addClass" : "removeClass"](CLASS.fixedBottom);

    if (this.pageMenuLeft && this.pageMenuRight) {

        this.pageMenuLeft.fix(true, this.touch.positionY !== this.touch.lastPositionY);
        this.pageMenuRight.fix(true, this.touch.positionY !== this.touch.lastPositionY);

        return this; //--->
    }
    
    setTimeout(function() {

        this.$pageMenu.css({
            display: savedDisplay
        });

        $items.css({
            transition: ""
        });

    }.bind(this), 0);

    return this;
};

PageMenu.prototype.reset = function ($selectable) {

    this.destroy();

    init.call(this, $selectable || this.init$selectable);
};

//Zobrazí menu. Pokud není použito vynucení (force), menu se zobrazí pouze, pokud je zoom 1 a stránka se needituje
PageMenu.prototype.show = function (force) {

    if (force) {

        this.hidden = false;

    } else {

        if (shouldBeHidden) {

            checkIfShoudBeHidden.call(this);
        }

        this.hidden = getZoom() > 1 || shouldBeHidden;
    }

    this.$pageMenu[this.hidden ? "addClass" : "removeClass"](CLASS.hidden);
    this.$pageMenu[this.hidden ? "removeClass" : "addClass"](CLASS.visible);

    if (this.pageMenuLeft && this.pageMenuRight) {

        this.pageMenuLeft.fix();
        this.pageMenuRight.fix();
    }

    return this;
};

//Skryje menu. Pokud není použito vynucení (force), menu se skryje pouze, pokud není otevřená žádná položka
PageMenu.prototype.hide = function (force) {

    if (force) {

        this.hidden = true;

    } else {

        this.hidden = !this.hasOpenedItem();
    }

    this.$pageMenu[this.hidden ? "addClass" : "removeClass"](CLASS.hidden);
    this.$pageMenu[this.hidden ? "removeClass" : "addClass"](CLASS.visible);

    return this;
};

PageMenu.prototype.hasOpenedItem = function () {

    return this.Page.get("openPageMenu");
};

PageMenu.CLASS = CLASS;

module.exports = PageMenu;
