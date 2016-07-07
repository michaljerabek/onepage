/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        module.exports = factory();

    } else {

        root.U = factory();
    }

}(this, function () {

    return {
        extend: function (subO, superO, staticM) {
            function object(obj) { function F() {} F.prototype = obj; return new F(); }
            var prototype = object(superO.prototype);
            prototype.constructor = subO;
            subO.prototype = prototype;
            if (staticM) { for (var i in superO) { subO[i] = superO[i]; }}
        },

        isIE11: function () {

            return !!window.MSInputMethodContext && !!document.documentMode;
        },

        viewportWidth: function () {

            return document.documentElement.clientWidth > window.innerWidth || navigator.userAgent.match(/Mobi/) ? window.innerWidth : document.documentElement.clientWidth;
        },

        viewportHeight: function () {

            return document.documentElement.clientHeight > window.innerHeight || navigator.userAgent.match(/Mobi/) ? window.innerHeight : document.documentElement.clientHeight;
        },

        offset: function (elem) {

            var rect = elem.getBoundingClientRect();

            return {
                top:  rect.top  + (window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop  || 0),
                left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0)
            };
        },

        eventData: function (event) {

            var source = event;

            event = event.original || event.originalEvent || event;

            var isTouchEvent = !!event.touches,

                hasOffset = event.offsetX !== undefined,
                offset = hasOffset || this.offset(event.target),

                offsetX = hasOffset ? event.offsetX : (isTouchEvent ? event.touches[0].pageX : event.pageX) - offset.left,
                offsetY = hasOffset ? event.offsetY : (isTouchEvent ? event.touches[0].pageY : event.pageY) - offset.top,

                clientX = isTouchEvent ? event.touches[0].clientX : event.clientX,
                clientY = isTouchEvent ? event.touches[0].clientY : event.clientY,

                pageX = isTouchEvent ? event.touches[0].pageX : event.pageX,
                pageY = isTouchEvent ? event.touches[0].pageY : event.pageY;

            return {
                type          : event.type,
                isTouchEvent  : isTouchEvent,

                pointers      : isTouchEvent ? event.touches.length : 1,

                target        : event.target,

                offsetX       : offsetX,
                offsetY       : offsetY,
                clientX       : clientX,
                clientY       : clientY,
                pageX         : pageX,
                pageY         : pageY,

                preventDefault: function () {
                    event.preventDefault();
                },
                stopPropagation: function () {
                    event.stopPropagation();
                },

                event         : event,
                source        : source
            };
        }
    };
}));

