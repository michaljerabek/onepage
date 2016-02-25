var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PageSchema = new Schema({

    name: {
        type: String
    },

    sections: Array,

    hostnames: [String]

});

/*Najde Page podle adresy, ze které uživatel přišel.*/
PageSchema.statics.findByHost = function (hostname, cb) {
    return this.findOne({ hostnames: hostname }, cb);
};

module.exports = function (connection) {

    return connection.model("Page", PageSchema);
};
