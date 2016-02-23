/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/
var Ractive = require("ractive");

var App = new Ractive({

    el: document.body,
    template: require("./tpl.html"),
    data: ractiveData

});
