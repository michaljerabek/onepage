/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PageSchema = new Schema({

    name: {
        type: String
    },

    sections: Array,

    settings: {
        type: Object,
        default: {
            lang: {
                defaultLang: {
                    type: String,
                    default: "cs"
                },
                langs: {
                    type: Object,
                    default: {
                        cs: {
                            template: "cs"
                        }
                    }
                }
            }
        }
    },

    hostnames: [String]

});

/*Najde Page podle adresy, ze které uživatel přišel.*/
PageSchema.statics.findByHost = function (hostname, cb) {
    return this.findOne({ hostnames: hostname }, cb);
};

module.exports = function (connection) {

    return connection.model("Page", PageSchema);
};
