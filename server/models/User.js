var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    databaseName: {
        type: String,
        required: true,
        unique: true
    },

    hostnames: [{
        type: String,
        unique: true
    }]

});

/*Najde uživatele podle adresy, ze které uživatel přišel.*/
UserSchema.statics.findByHost = function (hostname, cb) {
    return this.findOne({ hostnames: hostname }, cb);
};

/*Najde uživatele podle databáze.*/
UserSchema.statics.findByDatabaseName = function (databaseName, cb) {
    return this.findOne({ databaseName: databaseName }, cb);
};

module.exports = function (connection) {

    return connection.model("User", UserSchema);
};
