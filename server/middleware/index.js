/*jslint devel: true, node: true, plusplus: true, sloppy: true*/
/*jshint node: true*/

var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");

var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);

module.exports = function (app, express, config) {

    /*spuštění webpacku a vlastního nastavení dev serveru*/
    if (app.get("env") === "development") {

        require("./dev")(app);
    }

    app.use(logger("dev"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));

    app.use(session({
        secret: "aEcGcHrZjfDRbcddSD",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            secret: "aEcGcHrZjfDRbcddSD",
            url: "mongodb://localhost/global"
        })
    }));

    /*Přiřazení adresy k requestu.*/
    app.use(function (req, res, next) {

        req.hostname = req.headers.host.split(":").shift();

        next();
    });

    var dbMiddleware = require("./db");

    app.use(dbMiddleware.start(config));

    app.use(dbMiddleware.end());

};

