/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/

var extend = require("extend");
var on = require("./../helpers/on");

module.exports = extend({}, require("./shared"), on.server ? require("./server") : require("./client"));
