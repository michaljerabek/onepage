/*jslint browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true, node: true*/
var lrserver = require("tiny-lr")();
var webpack = require("webpack");
var webpackMiddleware = require("webpack-dev-middleware");
var path = require("path");

module.exports = function (app, webpackConfigPath, livereloadPort) {

    var webpackConfig = require(webpackConfigPath || "./../webpack.config.js");
    var livereloadServerConfig = {
        port: livereloadPort || 35729
    };

    var webpackCompiller = webpack(webpackConfig);

    var triggerLiveReloadChanges = function () {
        lrserver.changed({
            body: {
                files: [webpackConfig.output.filename]
            }
        });
    };

    lrserver.listen(livereloadServerConfig.port, triggerLiveReloadChanges);

    webpackCompiller.plugin("done", triggerLiveReloadChanges);

    app.use(webpackMiddleware(webpackCompiller, {
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true
        }
    }));

    app.use(require("connect-livereload")(livereloadServerConfig));

};
