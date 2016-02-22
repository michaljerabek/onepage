/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: ['webpack/hot/dev-server',
            'webpack-hot-middleware/client', "./app/main.js"],
    output: {
        path: "/",
        publicPath: "http://localhost/js/",
        filename: "bundle.js"
    },
    resolve: {
        extentions: ["js", ""]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};
