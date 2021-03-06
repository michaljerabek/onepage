/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global jQuery*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        module.exports = factory();

    } else {

        root.FixedElement = factory();
    }

}(this, function () {

    var FixedElement = (function ($) {

        var $win = $(window),

            counter = 1,

            isMobile = /Mobi/.test(navigator.userAgent),

            constructor = function FixedElement($selectable, options) {

                this.id = "fixedElement-" + (counter++);

                this.throttle = options && typeof options.throttle !== "undefined" ? options.throttle : 250;
                this.zoom = options && typeof options.zoom !== "undefined" ? options.zoom : true;

                this.isSleeping = true;

                this.init($selectable);
            };

        constructor.prototype.fix = function(noTransitions, hardFix) {

            var savedDisplay = "";

            if (noTransitions || hardFix) {

                savedDisplay = this.$fixedElement.css("display");

                this.$fixedElement.css({
                    display: hardFix ? "none" : "",

                    transition: "none"
                });
            }

            if (this.zoom || document.documentElement.clientWidth / window.innerWidth <= 1 || hardFix) {

                var position = this.calculatePosition();

                this.transform(position.left, position.top);
            }

            if (noTransitions || hardFix) {

                if (hardFix) {

                    this.$fixedElement.css({
                        display: savedDisplay
                    });
                }

                setTimeout(function() {

                    this.$fixedElement.css({
                        transition: ""
                    });

                }.bind(this), 0);
            }

            return this;
        };

        constructor.prototype.fixOnNext = function(noTransitions, hardFix) {

            setTimeout(this.fix.bind(this, noTransitions, hardFix), 0);

            return this;
        };

        constructor.prototype.init = function ($selectable) {

            this.$fixedElement = $($selectable);

            this.$fixedElement.css({
                transition: "none"
            });

            this.wake();

            this.fix();

            setTimeout(function() {

                this.$fixedElement.css({
                    transition: ""
                });

            }.bind(this), 0);

            return this;
        };

        constructor.prototype.destroy = function () {

            this.sleep();

            this.$fixedElement = null;

            return this;
        };

        constructor.prototype.sleep = function () {

            if (this.isSleeping) {

                return true;
            }

            clearTimeout(this.eventThrottle);

            $win.off("scroll." + this.id + " resize." + this.id + " orientationchange." + this.id);

            this.isSleeping = true;

            return true;
        };

        constructor.prototype.wake = function () {

            if (this.isSleeping) {

                this.eventThrottle = null;

                $win.on("scroll." + this.id + " resize." + this.id + " orientationchange." + this.id, function () {

                    clearTimeout(this.eventThrottle);

                    if (this.throttle) {

                        this.eventThrottle = setTimeout(this.fix.bind(this), this.throttle);

                    } else {

                        this.fix();
                    }

                }.bind(this));

                this.isSleeping = false;
            }

            return true;
        };

        constructor.prototype.calculatePosition = function () {

            var scrollWidth = document.documentElement.offsetWidth,
                scrollHeight = document.documentElement.offsetHeight,
                viewWidth = document.documentElement.clientWidth > window.innerWidth || isMobile ? window.innerWidth : document.documentElement.clientWidth,
                viewHeight = document.documentElement.clientHeight > window.innerHeight || isMobile ? window.innerHeight : document.documentElement.clientHeight,

                scrollLeft = Math.max(0, $win.scrollLeft()),
                scrollTop = Math.max(0, $win.scrollTop());

            scrollLeft = Math.min(scrollLeft, scrollWidth - viewWidth);
            scrollTop = Math.min(scrollTop, scrollHeight - viewHeight);

            if (this.isFixedToRight()) {

                scrollLeft = scrollLeft - (scrollWidth - viewWidth);
            }

            if (this.isFixedToBottom()) {

                scrollTop = scrollTop - (scrollHeight - viewHeight);
            }

            return {
                top: scrollTop,
                left: scrollLeft
            };
        };

        constructor.prototype.transform = function (left, top) {

            this.$fixedElement.css({
                transform: "translate(" + left + "px, " + top + "px)"
            });

            return this;
        };

        constructor.prototype.isFixedToRight = function () {

            var css = this.$fixedElement.css("right");

            return !isNaN(parseFloat(css));
        };

        constructor.prototype.isFixedToLeft = function () {

            var css = this.$fixedElement.css("left");

            return !isNaN(parseFloat(css));
        };

        constructor.prototype.isFixedToTop = function () {

            var css = this.$fixedElement.css("top");

            return !isNaN(parseFloat(css));
        };

        constructor.prototype.isFixedToBottom = function () {

            var css = this.$fixedElement.css("bottom");

            return !isNaN(parseFloat(css));
        };

        return constructor;

    }(jQuery));

    return FixedElement;

}));
