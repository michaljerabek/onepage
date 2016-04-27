/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var mongoose = require("mongoose");
var searchPlugin = require("mongoose-searchable");
var Schema = mongoose.Schema;

var IconSchema = new Schema({

    data: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true,
        index: true
    },

    tags: {
        type: [String],
        text: true
    },

    name: {
        type: String,
        index: true
    }
});

IconSchema.plugin(searchPlugin, {
    fields: ["tags", "category", "name"],
    language: "english"
});

IconSchema.statics.userSearch = function (searchText, cb) {
    return this.search(searchText, cb);
};

IconSchema.statics.findByCategory = function (category, cb) {
    return this.find({category: category}, cb);
};

IconSchema.statics.getCategories = function (cb) {
    return this.distinct("category", cb);
};

module.exports = mongoose.model("Icon", IconSchema);
