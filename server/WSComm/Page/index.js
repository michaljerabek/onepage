/*jslint white: true, nomen: true, regexp: true, unparam: true, indent: 4, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var PageModel = require("./../../models/Page");

module.exports = function (req, db) {

    var Page = PageModel(db);

    req("page", function (req, res) {

        Page.findOne({_id: req.params._id}, function (err, page) {

            res(page);

        });
    });

    req("page.save", function (req, res) {

        var query = {_id: req.params._id},

            update = {
                $set: {
                    settings: req.params.settings,
                    sections: req.params.sections,
                        name: req.params.name
                }
            };

        Page.findOneAndUpdate(query, update, function (err, result) {

            res(err || !result ? {error: err} : {saved: 1});
        });
    });

    req("page.registerUserEmail", function (req, res) {

        if (req.params.email) {

            return setTimeout(function() {
                res({ok: 1});
            }, 1000);
        }

        res({error: 1});
    });
};
