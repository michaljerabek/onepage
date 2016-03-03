/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var config = require("./../../config");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");

var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var flash = require("express-flash");

module.exports = function (app, express) {

    /*spuštění webpacku a vlastního nastavení dev serveru*/
    if (app.get("env") === "development") {

        require("./dev")(app);
    }

    /*Přiřazení adresy k requestu.*/
    app.use(function (req, res, next) {

        req.hostname = req.headers.host.split(":").shift();

        next();
    });

    app.use(logger("dev"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "../../public")));
    app.use(flash());

    app.use(session({
        secret: "--__X_-_X-_-X-_-X_-_X__--",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            secret: "--__X_-_X-_-X-_-X_-_X__--",
            url: "mongodb://localhost/" + config.Db.global.name
        })
    }));

    var dbMws = require("./db");

    require("./passport")(app);

    app.use(dbMws.reqStart);
    app.use(dbMws.resEnd);

    /*Najde stránku podle adresy.*/
    app.use(require("./pageRequest"));
};

