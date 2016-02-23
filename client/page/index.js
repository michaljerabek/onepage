var Ractive = require("ractive");

module.exports = Ractive.extend({
    template: "<h2>{{test}}</h2>",
    onrender: function () {
        this.req("/test", { ok: 1 }).then(function (res) {
            console.log(res);
        });
    }
});
