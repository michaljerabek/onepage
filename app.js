/*jslint devel: true, node: true, plusplus: true, sloppy: true*/
/*jshint node: true*/
var path = require("path");

var config = require("./config");

var express = require("express");
var app = express();

var middleware = require("./server/middleware");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

middleware(app, express, config);

/*Routes*/
var pageRoutes = require("./server/routes/Page");
var adminRoutes = require("./server/routes/Admin");
var usersRoutes = require("./server/routes/users");

app.use("/admin", function (req, res, next) {

    if (req.hostname === config.appHostname) {

        return next();
    }

    /*Uživatel se pravděpodobně pokouší použít adresu své stránky pro administraci (např. mujweb.cz/admin).*/
    return res.redirect("http://" + config.appHostname + "/admin");

}, adminRoutes);

app.use("/users", usersRoutes);

app.get(/\w+/i, function (req, res, next) {

    if (req.hostname !== config.appHostname) {

        return next();
    }

    return res.redirect("/");
});

app.get("/", function (req, res, next) {

    if (req.hostname !== config.appHostname) {

        return next();
    }

    return res.send("Tady bude prezentační stránka systému!");
});

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
