/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

var ParallaxController = (function () {

        var initialized = false,

            instanceCounter = 0,
            parallaxInstances = {},

            $win,
            winHeight = 0,
            winWidth = 0,
            winScrollTop = 0,

            updateParallaxes = function (type, event) {

                winScrollTop = $win.scrollTop();

                $.each(parallaxInstances, function (i, parallax) {

                    var backgroundOffsetTop = parallax.getOffset(),
                        backgroundBottom = backgroundOffsetTop + parallax.getBackgroundHeight(),

                        winBottom = winScrollTop + winHeight;

                    if (winBottom > backgroundOffsetTop && winScrollTop < backgroundBottom) {

                        parallax.transform(event);
                    }
                });
            },

            getWinScrollTop = function () {

                return winScrollTop;
            },

            refresh = function () {

                winHeight = $win.height();
                winWidth = $win.width();
                winScrollTop = $win.scrollTop();

                $.each(parallaxInstances, function (i, parallax) {

                    parallax.refresh();
                });
            },

            init = function () {

                if (initialized) {

                    return;
                }

                $win = $(window);

                winHeight = $win.height();
                winWidth = $win.width();
                winScrollTop = $win.scrollTop();

                $win.on("scroll.ParallaxController", updateParallaxes.bind(this))
                    .on("resize.ParallaxController", refresh);

                initialized = true;
            },

            destroy = function () {

                $win.off("scroll.ParallaxController")
                    .off("resize.ParallaxController");

                initialized = false;
            },

            add = function (parallax) {

                if (!parallaxInstances[parallax.id]) {

                    instanceCounter++;

                    parallaxInstances[parallax.id] = parallax;
                }
            },

            remove = function (parallax) {

                if (parallaxInstances[parallax.id]) {

                    instanceCounter--;

                    delete parallaxInstances[parallax.id];

                    if (!instanceCounter) {

                        destroy();
                    }
                }
            },

            getWinHeight = function () {

                return winHeight;
            },

            getWinWidth = function () {

                return winWidth;
            };

        return {
            init: init,
            destroy: destroy,
            refresh: refresh,

            add: add,
            remove: remove,

            getWinHeight: getWinHeight,
            getWinWidth: getWinWidth,
            getWinScrollTop: getWinScrollTop
        };

    }());


var instanceCounter = 0,

    Parallax = function Parallax(backgroundImageComponent) {

        this.id = "Parallax-" + (instanceCounter++);

        this.BackgroundImage = backgroundImageComponent;
        this.CLASS = backgroundImageComponent.CLASS;

        return this.refresh(true, backgroundImageComponent);
    };

Parallax.prototype.destroy = function () {

    this.$image.css({
        transform: ""
    });

    this.$background = null;
    this.$image = null;

    ParallaxController.remove(this);

    this.initialized = false;
};

Parallax.prototype.refresh = function (elements) {

    ParallaxController.init();
    ParallaxController.add(this);

    if (elements || !this.$background || !this.$image) {

        this.$background = $(this.BackgroundImage.find("." + this.CLASS.self));
        this.$image = this.$background.find("." + this.CLASS.image);
    }

    this.backgroundHeight = this.$background.outerHeight();
    this.imageHeight = this.$image.outerHeight();

    this.getOffset();

    this.parallaxExtention = (this.imageHeight - this.backgroundHeight) / 2;
    this.parallaxOuterRange = this.backgroundHeight + ParallaxController.getWinHeight();

    this.initialized = true;

    this.transform();
};

Parallax.prototype.getOffset = function () {

    this.offsetTop = this.$background.offset().top;

    return this.offsetTop;
};

Parallax.prototype.transform = function () {

    if (!this.initialized) {

        return;
    }

    var backgroundBottom = this.offsetTop + this.imageHeight,

        parallaxProgression = ((backgroundBottom - ParallaxController.getWinScrollTop()) / this.parallaxOuterRange) * 2,
        progressionFromCenter = parallaxProgression > 1 ? (parallaxProgression - 1) * -1: 1 - parallaxProgression,

        transform = (this.parallaxExtention * progressionFromCenter - (this.imageHeight / 2));

    this.$image.css({
        transform: "translateY(" + transform + "px)"
    });
};

Parallax.prototype.getBackgroundHeight = function () {

    return this.backgroundHeight;
};

module.exports = Parallax;

