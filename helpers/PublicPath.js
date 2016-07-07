/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        module.exports = factory();

    } else {

        root.PublicPath = factory();
    }

}(this, function () {

    return {
        from: function (path) {

            return "/" + (path || "").trim().replace(/\\/g, "/").replace(/^\/?(?:public)?\/?/i, "");
        }
    };

}));
