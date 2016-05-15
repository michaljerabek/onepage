/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $, MutationObserver*/
var Ractive = require("ractive"),

    U = require("./../../U"),

    EventEmitter = require("./../../EventEmitter")();

var CLASS = {
        resizableElement: "ResizableBox",
        resizableBox: "ResizableBox--self",

        scrollingElement: "ResizableBox--scrollable",
        scrollingContent: "ResizableBox--scrolling-content",

        resizer: "ResizableBox--resizer",
        resizerActive: "ResizableBox--resizer__active",

        minmax: "ResizableBox--min-max",
        minmaxMax: "ResizableBox--min-max__max",
        minmaxMin: "ResizableBox--min-max__min"
    },

    instanceCounter = 0;

var ResizableBox = function () {

    return initResizableBox.apply(this.decorators.ResizableBox ? this : this.parent, arguments);
};

var initResizableBox = function (node, floating, wheelPropagation) {

    Ractive.$win = Ractive.$win || $(window);

    this.BOX_EVENT_NS = "ResizableBox-" + (++instanceCounter);
    this.floating = floating;

    this.minmaxing = true;

    this.getSettingsHeight = ResizableBox.getSettingsHeight.bind(this);
    this.getSettingsWidth = ResizableBox.getSettingsWidth.bind(this);
    this.activateResizer = ResizableBox.activateResizer.bind(this);
    this.minmax = ResizableBox.minmax.bind(this);

    var originalComplete = this.oncomplete;

    this.oncomplete = function () {

        ResizableBox.oncomplete.call(this);

        originalComplete.apply(this, arguments);
    };

    this.self = this.self || this.find("." + this.CLASS.self);
    this.$self = this.$self || $(this.self);
    this.resizableBox  = node;
    this.$resizableBox = $(node);
    this.$scrollingElement = this.$resizableBox.is("." + CLASS.scrollingElement) ? this.$resizableBox : this.$resizableBox.find("." + CLASS.scrollingElement);
    this.$scrollingContent = this.$scrollingElement.find("." + CLASS.scrollingContent);
    this.resizableElement = this.find("." + CLASS.resizableElement);
    this.$resizableElement = $(this.resizableElement);

    this.minmaxButton = this.find("." + CLASS.minmax);

    this.minmaxButton.classList.add(CLASS.minmaxMin);
    this.resizableBox.classList.add(CLASS.resizableBox);

    this.initHeight = this.getSettingsHeight();

    if (floating) {

        this.initWidth = this.getSettingsWidth();
    }

    this.beforeHeight = this.initHeight;

    if (floating) {

        this.beforeWidth = this.initWidth;
    }

    this.minHeight = parseFloat(this.$resizableElement.css("min-height")) || 0;

    if (floating) {

        this.minWidth = parseFloat(this.$resizableElement.css("min-width")) || 0;
    }

    this.minResizeHeight = parseFloat(this.$resizableBox.attr("data-min-resize-height")) || 0;
    this.maxResizeHeight = parseFloat(this.$resizableBox.attr("data-max-resize-height")) || 0;

    if (floating) {

        this.minResizeWidth = parseFloat(this.$resizableBox.attr("data-min-resize-width")) || 0;
        this.maxResizeWidth = parseFloat(this.$resizableBox.attr("data-max-resize-width")) || 0;

        if (this.maxResizeWidth) {

            if (this.maxResizeWidth > window.innerWidth) {

                this.maxResizeWidth = window.innerWidth - 20;

            }

            Ractive.$win.on("resize." + this.BOX_EVENT_NS, function () {

                if (this.maxResizeWidth > window.innerWidth) {

                    this.maxResizeWidth = window.innerWidth - 20;

                } else {

                    this.minResizeWidth  = parseFloat(this.$resizableBox.attr("data-min-resize-width")) || 0;
                }

            }.bind(this));
        }
    }

    this.lastRects = ResizableBox.getRectsForScrollables.call(this);
    this.lastMutation = +new Date();

    this.contentObserver = new MutationObserver(ResizableBox.contentMutationObserver.bind(this));

    ResizableBox.initChangeObservers.call(this);

    this.$scrollingElement
        .css({
            position: "relative"
        })
        .perfectScrollbar({
            wheelPropagation: wheelPropagation || false,
            swipePropagation: true
        });

    this.observe("resizableElementHeight", ResizableBox.observeHeight, {init: false});
    this.observe("resizableElementWidth", ResizableBox.observeWidth, {init: false});

    if (this.onresizableboxinit) {

        this.onresizableboxinit();
    }

    var _this = this;

    return {
        teardown: function () {

            ResizableBox.cancelChangeObservers.call(_this);

            clearTimeout(_this.sizeTimeout);
            clearTimeout(_this.transitionTimeout);
            clearTimeout(_this.refreshThrottle);

            _this.$scrollingElement
                .css({
                    position: ""
                })
                .perfectScrollbar("destroy");

            Ractive.$win.off("." + _this.BOX_EVENT_NS);
        }
    };
};

ResizableBox.refreshScrollbars = function () {

    clearTimeout(this.refreshThrottle);

    this.refreshThrottle = setTimeout(function() {

        this.$scrollingElement.each(function (i, element) {

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
                            clearTimeout(this.refreshThrottle);
                        }.bind(this),
                        complete: function () {
                            $element.perfectScrollbar("update");
                        }
                    });

            } else if (elementRect.bottom < contentRect.bottom) {

                $element.stop().perfectScrollbar("update");
            }
        }.bind(this));

    }.bind(this), 50);
};

ResizableBox.getRectsForScrollables = function () {

    var rects = {};

    if (this.$scrollingContent) {

        this.$scrollingContent.each(function (i, el) {

            rects[i] = el.getBoundingClientRect();
        });
    }

    return rects;
};

ResizableBox.onContentChange = function (delay) {

    var currentRects = ResizableBox.getRectsForScrollables.call(this);

    $.each(currentRects, function (i, rect) {

        if (rect.width !== this.lastRects[i].width || rect.height !== this.lastRects[i].height) {

            var isMax = this.minmaxButton.classList.contains(CLASS.minmaxMax) && !this.minmaxButton.classList.contains(CLASS.minmaxMin),
                isMin = !isMax;

            clearTimeout(this.sizeTimeout);

            this.set("resizableElementHeight", this.getSettingsHeight());

            if (this.floating) {

                this.set("resizableElementWidth", this.getSettingsWidth());
            }

            this.sizeTimeout = setTimeout(function() {

                if (isMin) {

                    this.beforeHeight = this.getSettingsHeight();

                    if (this.floating) {

                        this.beforeWidth = this.getSettingsWidth();
                    }
                }

                if (!this.wasResized) {

                    this.minmax(null, isMax, isMin);

                } else {

                    this.wasResized = false;

                    this.set("resizableElementHeight", this.getSettingsHeight());

                    if (this.floating) {

                        this.set("resizableElementWidth", this.getSettingsWidth());
                    }
                }

            }.bind(this), delay || 50);

            return false;
        }

    }.bind(this));

    this.lastRects = currentRects;
};

ResizableBox.observeHeight =  function (height) {

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

        ResizableBox.refreshScrollbars.call(this);
    }
};

ResizableBox.observeWidth =  function (width) {

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

        ResizableBox.refreshScrollbars.call(this);
    }
};

ResizableBox.contentMutationObserver = function (mutations) {

    var currentTime = +new Date();

    if (currentTime - this.lastMutation < 50) {

        this.lastMutation = currentTime;

        return;
    }

    var m = mutations.length - 1,
        scrollbarMutations = 0;

    for (m; m >= 0; m--) {

        if (mutations[m].target && mutations[m].target.className && mutations[m].target.className.match("ps-scrollbar")) {

            scrollbarMutations++;
        }
    }

    if (mutations.length === scrollbarMutations) {

        return;
    }

    if (this.find("." + CLASS.resizerActive)) {

        return;
    }

    if (!this.minmaxing) {

        var css = {
            transition: "none",
            height: this.getSettingsHeight()
        };

        if (this.floating) {

            css.width = this.getSettingsWidth();
        }

        this.$resizableBox.css(css);
    }

    this.lastMutation = currentTime;

    ResizableBox.onContentChange.call(this);
};

ResizableBox.initChangeObservers = function () {

    EventEmitter.on("change.ResizableBox." + this.BOX_EVENT_NS, function () {
       ResizableBox.contentMutationObserver.call(this, [{}]);
    }.bind(this));

    this.contentObserver.disconnect();

    this.contentObserver.observe(this.resizableBox, { attributes: true, childList: true, characterData: true, subtree: true });
};

ResizableBox.cancelChangeObservers = function () {

    EventEmitter.off("change.resizableBox." + this.BOX_EVENT_NS);

    this.contentObserver.disconnect();
};

ResizableBox.minmax = function (event, forceMax, forceMin) {

    if (this.minmaxing && !event) {

        this.nextRequest = true;

        return;
    }

    this.minmaxing = true;

    ResizableBox.cancelChangeObservers.call(this);

    if (event) {

        event.original.srcEvent.stopPropagation();
        event.original.srcEvent.preventDefault();
    }

    //posuvníky je potřeba aktualizovat až na konci
    this.doNotUpdateScrollbars = true;

    this.$resizableBox
        .off("transitionend.resize-" + this.BOX_EVENT_NS)
        .css({
            transition: "none"
        });

    clearTimeout(this.clearAnimStyles);
    clearTimeout(this.transitionTimeout);

    this.resizableBox.style.height = "";

    if (this.floating) {

        this.resizableBox.style.width = "";
    }

    var currentHeight = this.get("resizableElementHeight"),
        currentWidth,

        maximize = false;

    if (this.floating) {

        currentWidth = this.get("resizableElementWidth");
    }

    //zmenšit na výchozí velikost
    if (forceMin || (!forceMax && this.minmaxButton.classList.contains(CLASS.minmaxMax))) {

        var sameAsBefore;

        if (this.floating) {

            sameAsBefore = !forceMin && this.beforeHeight === currentHeight && this.beforeWidth === currentWidth;

            this.set("resizableElementHeight", sameAsBefore ? this.initHeight : forceMin ? this.userDefHeight: this.beforeHeight);
            this.set("resizableElementWidth" , sameAsBefore ? this.initWidth  : forceMin ? this.userDefWidth: this.beforeWidth);

            if (!forceMin) {

                this.userDefHeight = this.get("resizableElementHeight");
                this.userDefWidth  = this.get("resizableElementWidth");
            }

        } else {

            sameAsBefore = !forceMin && this.beforeHeight === currentHeight;

            this.set("resizableElementHeight", sameAsBefore ? this.initHeight : forceMin ? this.userDefHeight: this.beforeHeight);
        }

        this.minmaxButton.classList.remove(CLASS.minmaxMax);
        this.minmaxButton.classList.add(CLASS.minmaxMin);

        //zvětšit na maximální velikost
    } else {

        if (!forceMax) {

            this.beforeHeight = this.get("resizableElementHeight");
        }

        if (this.maxResizeHeight) {

            this.set("resizableElementHeight", this.maxResizeHeight);
        }

        if (this.floating) {

            if (!forceMax) {

                this.beforeWidth = this.get("resizableElementWidth");
            }

            if (this.maxResizeWidth) {

                this.set("resizableElementWidth", this.maxResizeWidth);
            }
        }

        this.minmaxButton.classList.remove(CLASS.minmaxMin);
        this.minmaxButton.classList.add(CLASS.minmaxMax);

        maximize = true;
    }

    var offset, selfRect, resizableBoxRect;

    if (this.floating) {

        offset   = this.$self.offset();
        selfRect = this.self.getBoundingClientRect();
    }

    //zjistit konečné rozměry boxu
    resizableBoxRect = this.resizableBox.getBoundingClientRect();

    //použije se, pokud nenastane transitionend
    this.clearAnimStyles = setTimeout(function () {

        if (this.minResizeHeight) {

            this.resizableBox.style.minHeight = resizableBoxRect.height >= this.minResizeHeight ? this.minResizeHeight + "px" : resizableBoxRect.height + "px";
        }

        if (this.floating && this.minResizeWidth) {

            this.resizableBox.style.minWidth = resizableBoxRect.width >= this.minResizeWidth ? this.minResizeWidth + "px" : resizableBoxRect.width + "px";
        }

        ResizableBox.initChangeObservers.call(this);

    }.bind(this), 1000);

    //po zjištění rozměrů po změně velikosti, je potřeba vrátit původní hodnoty kvůli animaci
    this.set("resizableElementHeight", currentHeight);

    if (this.floating) {

        this.set("resizableElementWidth", currentWidth);
    }

    //pokud se velikost nezmění může se funkce ukončit
    if (resizableBoxRect.height === currentHeight && (!this.floating || resizableBoxRect.width === currentWidth)) {

        this.doNotUpdateScrollbars = false;

        this.minmaxing = false;

        clearTimeout(this.clearAnimStyles);

        ResizableBox.refreshScrollbars.call(this);

        ResizableBox.initChangeObservers.call(this);

        return;
    }

    //začátek animace: zafixování současné velikosti
    this.resizableBox.style.height = currentHeight + "px";

    //Je potřeba odstranit maxVelikost, aby bylo možné roztáhnout element na požadovanou velikost.
    //V případě, že se změní obsah a box není maximalizovaný, je potřeba velikost zafixovat,
    //protože by měla zůstat stejná.
    this.resizableBox.style.maxHeight = (forceMin ? this.userDefHeight + "px" : "none");

    if (maximize && this.maxResizeHeight) {

        this.resizableBox.style.maxHeight = this.maxResizeHeight + "px";
    }

    this.resizableBox.style.minHeight = this.minHeight + "px";

    if (this.floating) {

        //začátek animace: zafixování současné velikosti
        this.resizableBox.style.width = currentWidth + "px";

        //Je potřeba odstranit maxVelikost, aby bylo možné roztáhnout element na požadovanou velikost.
        //V případě, že se změní obsah a box není maximalizovaný, je potřeba velikost zafixovat,
        //protože by měla zůstat stejná.
        this.resizableBox.style.maxWidth = (forceMin ? this.userDefWidth + "px" : "none");

        if (maximize && this.maxResizeWidth) {

            this.resizableBox.style.maxWidth = this.maxResizeWidth + "px";
        }

        this.resizableBox.style.minWidth = this.minWidth + "px";
    }

    this.transitionTimeout = setTimeout(function() {

        //spuštění animace: konečná velikost
        this.resizableBox.style.height = resizableBoxRect.height + "px";

        if (this.floating) {

            this.resizableBox.style.width = resizableBoxRect.width + "px";
        }

        var eventId = +new Date();

        this.$resizableBox
            .css({
                transition: ""
            })
            .on("transitionend.resize-" + this.BOX_EVENT_NS + "." + eventId, function (e) {

            if (e.originalEvent.propertyName === "height" || (this.floating && e.originalEvent.propertyName === "width")) {

                //iOS fix
                this.$resizableBox.css({
                    transition: "none"
                });

                this.$resizableBox.off("transitionend.resize-" + this.BOX_EVENT_NS + "." + eventId);

                //přiřadit aktuální vekost do max-rozměrů pro správnou funkčnost roztahování
                this.set("resizableElementHeight", this.getSettingsHeight());

                if (this.floating) {

                    this.set("resizableElementWidth", this.getSettingsWidth());
                }

                if (this.minResizeHeight) {

                    this.resizableBox.style.minHeight = resizableBoxRect.height >= this.minResizeHeight ? this.minResizeHeight + "px" : resizableBoxRect.height + "px";
                }

                if (this.floating && this.minResizeWidth) {

                    this.resizableBox.style.minWidth = resizableBoxRect.width >= this.minResizeHeight ? this.minResizeWidth + "px" : resizableBoxRect.width + "px";
                }

                clearTimeout(this.clearAnimStyles);

                ResizableBox.refreshScrollbars.call(this);

                if (this.floating) {

                    this.transitionTimeout = setTimeout(function() {

                        this.$resizableBox.css({
                            transition: ""
                        });

                        if (this.nextRequest) {

                            this.nextRequest = false;

                            ResizableBox.onContentChange.call(this, 100);
                        }

                        ResizableBox.initChangeObservers.call(this);

                        this.minmaxing = false;

                    }.bind(this), 0);

                } else {

                    this.$resizableBox.css({
                        transition: ""
                    });

                    ResizableBox.initChangeObservers.call(this);

                    this.minmaxing = false;

                    if (this.nextRequest) {

                        this.nextRequest = false;

                        ResizableBox.onContentChange.call(this, 100);
                    }
                }
            }
        }.bind(this));

        if (this.onresizableboxend) {

            if (this.floating) {

                this.onresizableboxend(offset, selfRect);

            } else {

                this.onresizableboxend(resizableBoxRect, true);
            }
        }

        this.doNotUpdateScrollbars = false;

    }.bind(this), 20);
};

ResizableBox.getSettingsHeight = function () {

    return this.resizableElement.getBoundingClientRect().height;
};

ResizableBox.getSettingsWidth = function () {

    return this.resizableElement.getBoundingClientRect().width;
};

ResizableBox.oncomplete = function () {

    this.set("resizableElementHeight", this.getSettingsHeight());

    this.userDefHeight = this.get("resizableElementHeight");

    if (this.floating) {

        this.set("resizableElementWidth", this.getSettingsWidth());

        this.userDefWidth = this.get("resizableElementWidth");
    }

    this.minmaxing = false;
};

ResizableBox.activateResizer = function (e, position) {

    var eventData = U.eventData(e),

        lastY = eventData.clientY,
        lastX = eventData.clientX,

        resized = false;

    if (eventData.pointers > 1) {

        return;
    }

    if (this.$self) {

        this.$self.css({
            transition: "none"
        });
    }

    eventData.target.classList.add(CLASS.resizerActive);

    Ractive.$win
        .off("mousemove." + this.BOX_EVENT_NS + " touchmove." + this.BOX_EVENT_NS)
        .on("mousemove." + this.BOX_EVENT_NS + " touchmove." + this.BOX_EVENT_NS, function (e) {

            var eventData = U.eventData(e);

            if (eventData.pointers > 1) {

                return;
            }

            if (this.$resizableBox) {

                var css = {
                    transition: "none",
                    height: ""
                };

                if (this.floating) {

                    css.width = "";
                }

                this.minmaxButton.classList.remove(CLASS.minmaxMax);

                this.$resizableBox.css(css);
            }

            if (position.match(/bottom|top/)) {

                var diffY = position.match(/bottom/) ? eventData.clientY - lastY : lastY - eventData.clientY;

                this.set("resizableElementHeight", this.getSettingsHeight() + diffY);
            }

            if (position.match(/left|right/)) {

                var diffX = position.match(/right/) ? eventData.clientX - lastX : lastX - eventData.clientX;

                this.set("resizableElementWidth" , this.getSettingsWidth()  + diffX);
            }

            if (this.onresizableboxresize) {

                this.onresizableboxresize(position);
            }

            lastY = eventData.clientY;
            lastX = eventData.clientX;

            resized = true;

            e.preventDefault();
            return false;

        }.bind(this))
        .one("mouseup." + this.BOX_EVENT_NS + " touchend." + this.BOX_EVENT_NS, function (e) {

        this.wasResized = resized;

        eventData.target.classList.remove(CLASS.resizerActive);

        if (resized) {

            this.set("resizableElementHeight", this.getSettingsHeight());

            this.userDefHeight = this.get("resizableElementHeight");

            if (this.floating) {

                this.set("resizableElementWidth", this.getSettingsWidth());

                this.userDefWidth = this.get("resizableElementWidth");
            }

            setTimeout(function() {

                this.wasResized = false;

            }.bind(this), 0);
        }

        if (this.$self) {

            this.$self.css({
                transition: ""
            });
        }

        Ractive.$win.off("mousemove." + this.BOX_EVENT_NS + " touchmove." + this.BOX_EVENT_NS);

        e.preventDefault();
        return false;

    }.bind(this));

    eventData.preventDefault();
    return false;
};

module.exports = ResizableBox;
