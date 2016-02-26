/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var Page = require("./../models/Page");

module.exports = function (req, res, next) {

    if (req.requestForPage && req.userDb) {

        Page(req.userDb).findByHost(req.hostname, function (err, page) {

            if (!page) {

                var error = new Error();
                error.status = 404;

                next(error);
            }

            req.Page = page;

            next(err);
        });

        return;
    }

    next();
};
