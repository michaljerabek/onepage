var express = require('express');
var router = express.Router();

require("ractive-require-templates");
var Ractive = require("ractive");

/* GET home page. */
router.get('/', function (req, res, next) {

    var data = {
        test: "test",
        num: 1
    };

    var App = new Ractive({
        template: require("./../../client/tpl.html"),
        data: data
    });

    res.render('index', {
        title: 'Express',
        ractiveHtml: App.toHtml(),
        ractiveData: JSON.stringify(data)
    });
});

module.exports = router;
