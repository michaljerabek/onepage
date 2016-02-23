/*jslint devel: true, node: true, plusplus: true, sloppy: true*/
/*jshint node: true*/
var path = require("path");

var config = require("./config");

var express = require("express");

var middleware = require("./server/middleware");

var pageRoutes = require("./server/page/routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

middleware(app, express);

/*Routes*/

app.use("/", pageRoutes);

/*Spuštění Socket.io*/
require("./server/WSComm");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {}
    });
});


module.exports = app;
