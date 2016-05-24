/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var path = require("path");
var webpack = require("webpack");

//var def = new webpack.DefinePlugin({
//    ADMIN: true
//});

module.exports = {
    entry: {
        page: ["./public/js/touch-dnd.js", "./client/Page.js", "webpack/hot/dev-server", "webpack-hot-middleware/client"],
        admin: ["./public/js/touch-dnd.js", "./client/Admin.js", "webpack/hot/dev-server", "webpack-hot-middleware/client"]
    },

    output: {
        path: "/",
        publicPath: "http://127.0.0.1:80/",
        filename: "js/[name].bundle.js"
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
