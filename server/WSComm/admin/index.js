/*jslint white: true, nomen: true, regexp: true, unparam: true, indent: 4, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var PageModel = require("./../../models/Page");

module.exports = function (req, db) {

    var Page = PageModel(db);

    req("/page", function (req, res) {

        Page.findOne({_id: req.params._id}, function (err, page) {

            res(page);

        });
    });
};
