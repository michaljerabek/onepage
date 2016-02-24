var Ractive = require("ractive");

module.exports = Ractive.extend({
    template: require("./index.tpl"),
    onrender: function () {
        this.req("/test", { ok: 1 }).then(function (res) {
            console.log(res);
        });
    }
});
