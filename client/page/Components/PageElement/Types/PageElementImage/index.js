/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageElement = require("./../../"),
            Ractive = require("ractive"),

            U = require("./../../../../../libs/U"),
            EventEmitter = require("./../../../../../libs/EventEmitter")(),
            on = require("./../../../../../../helpers/on"),

            partials = {
                pageElementEditUI: require("./edit-ui.tpl"),
                pageElementContent: require("./index.tpl")
            };

        module.exports = factory(
            PageElement,
            EventEmitter,
            Ractive,
            U,
            partials,
            on
        );

    } else {

        root.PageElementImage = factory(
            root.PageElement,
            root.EventEmitter,
            root.Ractive,
            root.U,
            {},
            {client: true}
        );
    }

}(this, function (PageElement, EventEmitter, Ractive, U, partials, on) {

    var CLASS = {
        imageElement: "P_PageElementImage",
        imageWrapper: "P_PageElementImage--image-wrapper"
    };

    return PageElement.extend({

        hasEditor: false,

        MAX_FILESIZE: 1,
        MAX_WIDTH: 2048,
        MAX_HEIGHT: 2048,

        components: {
            PageElementImageBrowser: require("./../../PageElementSettings/Types/PageElementImageBrowser")
        },

        partials: partials,

        data: function () {

            return {
                uploadable: true,
                hasEditUI: true,
                forceEditUI: true,
                activateButton: true,
                activateIcon: "#icon-add-image",
                type: "image",
                settingsTitle: "Vybrat obrázek"
            };
        },

        OPTIONS: {

            DROPZONE: function () {

                return {
                    url: "/upload-image",
                    paramName: "image",

                    uploadMultiple: false,
                    acceptedFiles: "image/jpg,image/jpeg,image/png",
                    maxFilesize: this.MAX_FILESIZE,

                    clickable: false,

                    thumbnailHeight: null,
                    thumbnailWidth: null,

                    dictInvalidFileType: "Nepodporovaný formát.",
                    dictFileTooBig: "Soubor je příliš velký ({{filesize}} MB). Velikost souboru může být maximálně {{maxFilesize}} MB.",
                    dictResponseError: "Soubor se nepodařilo nahrát (chyba: {{statusCode}})"
                };
            }
        },

        onconfig: function () {

            this.superOnconfig();

            if (Ractive.EDIT_MODE) {

                this.on("*.selectFile", function (event, file) {

                    if (file.width && file.height && (file.width > this.MAX_WIDTH || file.height > this.MAX_HEIGHT)) {

                        this.fire("showDialog", {
                            type: "error",
                            title: "Obrázek nelze použít",
                            text: [
                                "Obrázek může mít rozměry maximálně ",
                                this.MAX_WIDTH, "px x ", this.MAX_HEIGHT, "px. ",
                                "Rozměry vybraného obrázku jsou ",
                                file.width, "px x ", file.height,  "px."
                            ].join(""),
                            dismiss: {
                                text: "Zavřít"
                            }
                        });

                        return;
                    }

                    if (file.size > this.MAX_FILESIZE * 1024) {

                        this.fire("showDialog", {
                            type: "error",
                            title: "Obrázek nelze použít",
                            text: "Obrázek může být maximálně " + this.MAX_FILESIZE + " MB velký. Velikost vybraného obrázku je " + (file.size / 1024).toFixed(2) + " MB.",
                            dismiss: {
                                text: "Zavřít"
                            }
                        });

                        return;
                    }

                    this.set("element.src", encodeURIComponent(file.path));

                }.bind(this));

                this.deleteFileListener = this.Page.on("*.ImageBrowser-deleteFile", function (event, file) {

                    var image = this.get("element.src");

                    if (!image) {

                        return;
                    }

                    var filePath = file.path;

                    if (filePath === decodeURIComponent(image)) {

                        this.set("element.src", "");
                    }

                }.bind(this));

                this.on("removeImage", function () {

                    this.set("element.src", "");
                });
            }
        },

        onrender: function () {

            this.superOnrender();

            this.setDefaultValues();

            if (Ractive.EDIT_MODE) {

                this.on("activate", function (event) {

                    if (event.original.srcEvent.type.match(/touch/)) {

                        this.handleTouchstart({
                            original: event.original.srcEvent
                        });

                        this.handleTouchend({
                            original: event.original.srcEvent
                        });
                    }

                    this.find("." + CLASS.imageElement).focus();

                    this.set("state", "active");

                    this.fire("elementState", "active");
                });

                this.on("stateChange", function (state) {

                    if (state && this.focusin) {

                        this.set("state", "active");

                        this.fire("elementState", "active");

                    } else if (!state && !this.focusin) {

                        this.set("state", "inactive");

                        this.fire("elementState", "inactive");
                    }
                });

                this.initObservers();
            }
        },

        oncomplete: function () {

            this.superOncomplete();
        },

        setDefaultValues: function () {

        },

        initObservers: function () {

        },

        cancelObservers: function () {

        },

        onteardown: function () {

            this.cancelObservers();

            if (this.deleteFileListener) {

                this.deleteFileListener.cancel();
            }

            this.superOnteardown();
        },

        handleThumbnail: function (file, thumbnail) {

            if (file.accepted && !file.uploaded) {

                this.imageBeforeUpload = this.get("element.src") || "";

                this.set("element.src", thumbnail);
            }
        },

        handleUploadSuccess: function (file, res) {

            var browsers =
                    this.Page.findAllComponents("BackgroundImageBrowser")
                        .concat(this.Page.findAllComponents("ImageBrowser")),
                b = browsers.length - 1;

            if (browsers.length) {

                for (b; b >= 0; b--) {

                    browsers[b].addFileToUploadDirectory({
                        name: res.name,
                        path: res.path,
                        size: res.size,
                        width: file.width,
                        height: file.height
                    });
                }
            }

            if (file.width && file.height && (file.width > this.MAX_WIDTH || file.height > this.MAX_HEIGHT)) {

                this.fire("showDialog", {
                    type: "error",
                    title: "Obrázek nelze použít",
                    text: [
                        "Obrázek může mít rozměry maximálně ",
                        this.MAX_WIDTH, "px x ", this.MAX_HEIGHT, "px. ",
                        "Rozměry vybraného obrázku jsou ",
                        file.width, "px x ", file.height,  "px."
                    ].join(""),
                    dismiss: {
                        text: "Zavřít"
                    }
                });

                this.set("element.src", this.imageBeforeUpload);

                return;
            }

            this.set("element.src", encodeURIComponent(res.path));
        },

        handleUploadError: function () {

            this.set("element.src", this.imageBeforeUpload);
        },

        isEmpty: function () {

            return !this.get("element.src");
        }
    });

}));

