/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

var U = {
    extend: function (subO, superO, staticM) {
        function object(obj) { function F() {} F.prototype = obj; return new F(); }
        var prototype = object(superO.prototype);
        prototype.constructor = subO;
        subO.prototype = prototype;
        if (staticM) { for (var i in superO) { subO[i] = superO[i]; }}
    }
};

module.exports = U;
