module.exports = {
    Db: {
        global: {
            name: "global",
            host: "localhost"
        },
        users: {
            host: "localhost"
        }
    },

    websocket: {
        dbTimeout: 60 * 1000
    },

    appHostname: "app.dev",

    cache: {
        thumbs: 60 * 24 * 90,
        images: 60 * 24 * 30
    }
};
