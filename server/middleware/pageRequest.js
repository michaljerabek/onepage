/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var Page = require("./../models/Page");

var findPageByHost = function (req, res, next) {

        Page(req.userDb).findByHost(req.hostname, function (err, page) {

            if (!page) {

                var error = new Error();
                error.status = 404;

                next(error);

                return;
            }

            req.Page = page;

            next(err);
        });
    };

module.exports = function (req, res, next) {

    if (req.requestForPage && req.userDb) {

        var lang = req.path.replace(/^\/|\/$/g, "").split(/\//)[0] || "cs";

        req.pageLang = lang ? lang.toLowerCase() : lang;

        if (!lang || (lang.length === 2 && !lang.match(/js/))) {

            findPageByHost(req, res, next);

            return;
        }
    }

    next();
};
