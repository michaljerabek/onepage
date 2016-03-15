/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

var on = require("./../../helpers/on");

var EventEmitter = on.client ? $({}) : {};

module.exports = function () {
    return EventEmitter;
};
