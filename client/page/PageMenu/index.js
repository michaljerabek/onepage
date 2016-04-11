/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

var FixedElement = require("./../../libs/FixedElement"),
    U = require("./../../libs/U");

var instaceCounter = 0,

    CLASS = {
        self: "E_PageMenu",

        cssFixed: "E_PageMenu__css-fixed",
        hidden: "E_PageMenu__hidden",
        visible: "E_PageMenu__visible",

        showContent: "E_PageMenu--item__show-content",

        fixedTop: "E_PageMenu__fixed-top",
        fixedBottom: "E_PageMenu__fixed-bottom",

        item: "E_PageMenu--item",
        content: "E_PageMenu--content",
        contentWrapper: "E_PageMenu--content-wrapper",

        resizer: "E_PageMenu--resizer",
        resizerActive: "E_PageMenu--resizer__active"
    },

    setMaxHeight = function () {

        this.$pageMenu
            .find("." + CLASS.item + ", ." + CLASS.contentWrapper)
            .css({
                maxHeight: window.innerHeight
            });
    },

    resetLastResize = function () {

        this.$pageMenu
            .find("." + CLASS.item + ", ." + CLASS.contentWrapper)
            .css({
                width: ""
            });
    },

    getZoom = function () {

        return document.documentElement.clientWidth / window.innerWidth;
    },

    handleTouchstart = function (e) {

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

            if (this.touch.touches === 2) {

                this[getZoom() > 1 ? "hide": "show"]();
            }

            this.touch.touches = 0;
            this.touch.switched = false;

        }.bind(this), 75);
    },

    resizeThrottle = null,

    handleWinResize = function () {

        clearTimeout(resizeThrottle);

        if (getZoom() <= 1) {

            resizeThrottle = setTimeout(setMaxHeight.bind(this), 50);
        }

        this[getZoom() > 1 ? "hide": "show"]();
    },

    ensureVisibilityTimeout = null,

    ensureVisibility = function () {

        clearTimeout(ensureVisibilityTimeout);

        ensureVisibilityTimeout = setTimeout(function() {

            var shouldBeHidden = this.Page.get("sortableActive") && !this.Page.get("draggableActive");

            if (!shouldBeHidden) {

                this.Page.forEachPageSection(function () {

                    if (this.get("hasSettings") || this.get("hasOutline")) {

                        shouldBeHidden = true;

                        return false;
                    }
                });
            }

            this[shouldBeHidden ? "hide": "show"]();

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

                e.preventDefault();
                return false;

            }.bind(this));

        eventData.preventDefault();
        return false;
    },

    resetCurrentItem = function () {

        var $openedItem = this.$pageMenu.find("." + CLASS.showContent),
            $openedContentWrapper = $openedItem.find("." + CLASS.contentWrapper);

        $openedContentWrapper.perfectScrollbar("destroy");

        $openedItem.on("transitionend." + this.EVENT_NS, function (e) {

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

    addScrollbar = function () {

        var $openedContentWrapper = this.$pageMenu.find("." + CLASS.showContent + " ." + CLASS.contentWrapper);

        $openedContentWrapper.perfectScrollbar({
            swipePropagation: false
        });
    },

    init = function ($selectable) {

        this.init$selectable = $selectable;

        this.$pageMenu = $($selectable);

        this.touch = {};

        this.changePosition("top");

        this.$pageMenu
            .addClass(CLASS.cssFixed + " " + CLASS.visible);

        this.$win
            .on("resize."     + this.EVENT_NS, handleWinResize.bind(this))
            .on("touchstart." + this.EVENT_NS, handleTouchstart.bind(this))
            .on("touchmove."  + this.EVENT_NS, handleTouchmove.bind(this))
            .on("touchend."   + this.EVENT_NS, handleTouchend.bind(this));

        this.draggableActiveObserver = this.Page.observe("draggableActive", function (state) {

            if (state) {

                this.set("openPageMenu", null);
            }
        }, {init: false});

        this.openPageMenuObserver = this.Page.observe("openPageMenu", function (type) {

            if (type) {

                setMaxHeight.call(this);

            } else {

                resetCurrentItem.call(this);

                if (getZoom() > 1) {

                    this.hide();
                }
            }

        }, {init: false, context: this});

        this.openPageMenuObserverDefer = this.Page.observe("openPageMenu", function (type) {

            if (type) {

                addScrollbar.call(this);
            }

        }, {init: false, context: this, defer: true});

        this.sortableActiveObserver = this.Page.observe("sortableActive", ensureVisibility.bind(this), {init: false});

        this.Page.on("*.sectionHasOutline", ensureVisibility.bind(this));
        this.Page.on("*.openPageSectionSettings", ensureVisibility.bind(this));

        this.Page.on("activateResizer", activateResizer.bind(this));

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

    this.pageMenuLeft  = null;
    this.pageMenuRight = null;
    this.$pageMenu = null;
    this.touch = null;

    this.$win
        .off("touchstart." + this.EVENT_NS)
        .off("touchmove."  + this.EVENT_NS)
        .off("touchend."   + this.EVENT_NS);

    return this;
};

PageMenu.prototype.changePosition = function (position) {

    this.touch.lastPositionY = this.touch.positionY;

    this.touch.positionY = position;

    if (this.touch.positionY === this.touch.lastPositionY) {

        return this;
    }

    var $items = this.$pageMenu.find("." + CLASS.item),
        savedDisplay;

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

        return this;
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

PageMenu.prototype.show = function (force) {

    if (force) {

        this.hidden = false;

    } else {

        this.hidden = getZoom() > 1;
    }

    this.$pageMenu[this.hidden ? "addClass" : "removeClass"](CLASS.hidden);
    this.$pageMenu[this.hidden ? "removeClass" : "addClass"](CLASS.visible);
};

PageMenu.prototype.hide = function (force) {

    if (force) {

        this.hidden = true;

    } else {

        this.hidden = !this.hasOpenedMenu();

    }

    this.$pageMenu[this.hidden ? "addClass" : "removeClass"](CLASS.hidden);
    this.$pageMenu[this.hidden ? "removeClass" : "addClass"](CLASS.visible);
};

PageMenu.prototype.hasOpenedMenu = function () {

    return this.Page.get("openPageMenu");
};

PageMenu.CLASS = CLASS;

module.exports = PageMenu;
