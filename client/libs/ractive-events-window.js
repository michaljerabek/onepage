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
    }

}(this, function () {

    return {
        windowMousedown: function (node, fire) {

            var eventHandler = function (e) {

                fire({
                    node: node,
                    original: e,
                    clientX: e.clientX,
                    clientY: e.clientY
                });
            };

            window.addEventListener("mousedown", eventHandler, false);

            return {
                teardown: function () {
                    window.removeEventListener("mousedown", eventHandler);
                }
            };
        },
        windowMousemove: function (node, fire) {

            var eventHandler = function (e) {

                fire({
                    node: node,
                    original: e,
                    clientX: e.clientX,
                    clientY: e.clientY
                });
            };

            window.addEventListener("mousemove", eventHandler, false);

            return {
                teardown: function () {
                    window.removeEventListener("mousemove", eventHandler);
                }
            };
        },
        windowMouseup: function (node, fire) {

            var eventHandler = function (e) {

                fire({
                    node: node,
                    original: e,
                    clientX: e.clientX,
                    clientY: e.clientY
                });
            };

            window.addEventListener("mouseup", eventHandler, false);

            return {
                teardown: function () {
                    window.removeEventListener("mouseup", eventHandler);
                }
            };
        },

        windowTouchstart: function (node, fire) {

            var eventHandler = function (e) {

                fire({
                    node: node,
                    original: e,
                    clientX: e.changedTouches[0].clientX,
                    clientY: e.changedTouches[0].clientY
                });
            };

            window.addEventListener("touchstart", eventHandler, false);

            return {
                teardown: function () {
                    window.removeEventListener("touchstart", eventHandler);
                }
            };
        },
        windowTouchmove: function (node, fire) {

            var eventHandler = function (e) {

                fire({
                    node: node,
                    original: e,
                    clientX: e.changedTouches[0].clientX,
                    clientY: e.changedTouches[0].clientY
                });
            };

            window.addEventListener("touchmove", eventHandler, false);

            return {
                teardown: function () {
                    window.removeEventListener("touchmove", eventHandler);
                }
            };
        },
        windowTouchend: function (node, fire) {

            var eventHandler = function (e) {

                fire({
                    node: node,
                    original: e,
                    clientX: e.changedTouches[0].clientX,
                    clientY: e.changedTouches[0].clientY
                });
            };

            window.addEventListener("touchend", eventHandler, false);

            return {
                teardown: function () {
                    window.removeEventListener("touchend", eventHandler);
                }
            };
        }
    };

}));
