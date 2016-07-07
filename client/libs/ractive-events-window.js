/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global Ractive*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        module.exports = factory();

    } else {

        var events = factory();

        Ractive.defaults.events.windowMousedown = events.windowMousedown;
        Ractive.defaults.events.windowMousemove = events.windowMousemove;
        Ractive.defaults.events.windowMouseup = events.windowMouseup;
        Ractive.defaults.events.windowTouchstart = events.windowTouchstart;
        Ractive.defaults.events.windowTouchmove = events.windowTouchmove;
        Ractive.defaults.events.windowTouchend = events.windowTouchend;
        Ractive.defaults.events.windowResize = events.windowResize;
    }

}(this, function () {

    return {
        windowMousedown: function (node, fire) {

            var eventHandler = function (e) {

                if (!this.owner.rendered) {

                    window.removeEventListener("mousedown", eventHandler);

                    return;
                }

                fire({
                    node: node,
                    original: e,
                    clientX: e.clientX,
                    clientY: e.clientY
                });

            }.bind(this);

            window.addEventListener("mousedown", eventHandler, false);

            return {
                teardown: function () {
                    window.removeEventListener("mousedown", eventHandler);
                }
            };
        },
        windowMousemove: function (node, fire) {

            var eventHandler = function (e) {

                if (!this.owner.rendered) {

                    window.removeEventListener("mousemove", eventHandler);

                    return;
                }

                fire({
                    node: node,
                    original: e,
                    clientX: e.clientX,
                    clientY: e.clientY
                });

            }.bind(this);

            window.addEventListener("mousemove", eventHandler, false);

            return {
                teardown: function () {
                    window.removeEventListener("mousemove", eventHandler);
                }
            };
        },
        windowMouseup: function (node, fire) {

            var eventHandler = function (e) {

                if (!this.owner.rendered) {

                    window.removeEventListener("mouseup", eventHandler);

                    return;
                }

                fire({
                    node: node,
                    original: e,
                    clientX: e.clientX,
                    clientY: e.clientY
                });
            }.bind(this);

            window.addEventListener("mouseup", eventHandler, false);

            return {
                teardown: function () {
                    window.removeEventListener("mouseup", eventHandler);
                }
            };
        },

        windowTouchstart: function (node, fire) {

            var eventHandler = function (e) {

                if (!this.owner.rendered) {

                    window.removeEventListener("touchstart", eventHandler);

                    return;
                }

                fire({
                    node: node,
                    original: e,
                    clientX: e.changedTouches[0].clientX,
                    clientY: e.changedTouches[0].clientY
                });

            }.bind(this);

            window.addEventListener("touchstart", eventHandler, false);

            return {
                teardown: function () {
                    window.removeEventListener("touchstart", eventHandler);
                }
            };
        },
        windowTouchmove: function (node, fire) {

            var eventHandler = function (e) {

                if (!this.owner.rendered) {

                    window.removeEventListener("touchmove", eventHandler);

                    return;
                }

                fire({
                    node: node,
                    original: e,
                    clientX: e.changedTouches[0].clientX,
                    clientY: e.changedTouches[0].clientY
                });

            }.bind(this);

            window.addEventListener("touchmove", eventHandler, false);

            return {
                teardown: function () {
                    window.removeEventListener("touchmove", eventHandler);
                }
            };
        },
        windowTouchend: function (node, fire) {

            var eventHandler = function (e) {

                if (!this.owner.rendered) {

                    window.removeEventListener("touchend", eventHandler);

                    return;
                }

                fire({
                    node: node,
                    original: e,
                    clientX: e.changedTouches[0].clientX,
                    clientY: e.changedTouches[0].clientY
                });

            }.bind(this);

            window.addEventListener("touchend", eventHandler, false);

            return {
                teardown: function () {
                    window.removeEventListener("touchend", eventHandler);
                }
            };
        },
        windowResize: function (node, fire) {

            var eventHandler = function (e) {

                if (!this.owner.rendered) {

                    window.removeEventListener("resize", eventHandler);

                    return;
                }

                fire({
                    node: node,
                    original: e,
                    innerWidth: window.innerWidth,
                    innerHeight: window.innerHeight
                });

            }.bind(this);

            window.addEventListener("resize", eventHandler, false);

            return {
                teardown: function () {
                    window.removeEventListener("resize", eventHandler);
                }
            };
        }
    };

}));
