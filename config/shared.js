module.exports = {
    websocket: {
        port: 5000
    },

    upload: {
        images: {
            path: "uploads/users/{{userId}}/images",
            thumbPath: "uploads/users/{{userId}}/images/thumbs",
            thumbRelPath: "/thumbs",
            thumbQuality: 65,
            thumbWidth: 100,
            thumbHeight: 100,
            name: "Moje obrázky"
        },
        icons: {
            path: "uploads/users/{{userId}}/icons",
            thumbPath: "uploads/users/{{userId}}/icons/thumbs",
            thumbRelPath: "/thumbs",
            thumbQuality: 65,
            thumbWidth: 40,
            thumbHeight: 40,
            name: "Moje ikony"
        },
        files: {
            path: "uploads/users/{{userId}}/files",
            name: "Moje soubory"
        },

        storagePath: "uploads/users/{{userId}}",
        storageSize: 1024 * 1024 * 100 //100 MB
    },
    library: {
        path: "library",
        images: {
            path: "library/images",
            thumbPath: "library/images/thumbs",
            thumbRelPath: "/thumbs"
        },
        icons: {
            path: "db://"
        }
    }
};
