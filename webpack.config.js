/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        page: ["./public/js/touch-dnd.js", "./client/Page.js", "webpack/hot/dev-server", "webpack-hot-middleware/client"],
        admin: ["./public/js/touch-dnd.js", "./client/Admin.js", "webpack/hot/dev-server", "webpack-hot-middleware/client"]
    },

    output: {
        path: "/",
        publicPath: "http://localhost/js/",
        filename: "[name].bundle.js"
    },

    resolve: {
        extentions: ["js", ""]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    module: {
        loaders: [
            { test: /\.(html|tpl)$/, loader: "ractive" }
        ]
    }
};
