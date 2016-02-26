/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var bcrypt = require("bcrypt-nodejs");

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

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

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

/*Najde uživatele podle emailu.*/
UserSchema.statics.findByEmail = function (email, cb) {
    return this.findOne({ email: email }, cb);
};

/*Najde uživatele podle adresy, ze které uživatel přišel.*/
UserSchema.statics.findByHost = function (hostname, cb) {
    return this.findOne({ hostnames: hostname }, cb);
};

/*Najde uživatele podle databáze.*/
UserSchema.statics.findByDatabaseName = function (databaseName, cb) {
    return this.findOne({ databaseName: databaseName }, cb);
};

module.exports = mongoose.model("User", UserSchema);
