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
        imageElement: "P_PageElementIcon"
    };

    return PageElement.extend({

        hasEditor: false,

        MAX_FILESIZE: 0.1,
        MAX_WIDTH: 256,
        MAX_HEIGHT: 256,

        components: {
            PageElementIconBrowser: require("./../../PageElementSettings/Types/PageElementIconBrowser")
        },

        partials: partials,

        data: function () {

            return {
                uploadable: true,
                hasEditUI: true,
                forceEditUI: true,
                activateButton: true,
                activateIcon: "#icon-add-image",
                type: "icon",
                settingsTitle: "Vybrat ikonu",
                pulseOutline: false
            };
        },

        OPTIONS: {

            DROPZONE: function () {

                return {
                    url: "/upload-icon",
                    paramName: "icon",

                    uploadMultiple: false,
                    acceptedFiles: "image/png,image/svg+xml",
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

                    if (!file.svg) {

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

                        this.currentFilePath = encodeURIComponent(file.path);

                        this.set("pulseOutline", true);

                        if (!this.image) {

                            this.image = new Image();

                            this.image.onload = function () {

                                if (this.torndown) {

                                    return;
                                }

                                this.set("element.icon", this.currentFilePath);

                                this.set("pulseOutline", false);

                            }.bind(this);
                        }

                        this.image.src = this.currentFilePath;

                    } else {

                        this.set("element.icon", file.svg);

                    }

                }.bind(this));

                this.deleteFileListener = this.Page.on("*.IconBrowser-deleteFile", function (event, file) {

                    if (!file.svg) {

                        var icon = this.get("element.icon");

                        if (!icon) {

                            return;
                        }

                        var filePath = file.path;

                        if (filePath === decodeURIComponent(icon)) {

                            this.set("element.icon", "");
                        }
                    }

                }.bind(this));

                this.on("removeIcon", function () {

                    this.set("element.icon", "");
                });
            }
        },


        onrender: function () {

            this.superOnrender();

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

            if (!this.get("element.setColor")) {

                this.set("element.setColor", "fill");
            }
        },

        oninit: function () {

            this.superOninit();

            this.setDefaultValues();

            this.observe("element.setColor", function () {

                this.PageSection.set("stopColorTransitions", false);

            }, {init: false});
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

                this.set("pulseOutline", true);

                this.iconBeforeUpload = this.get("element.icon") || "";

                if (file.size / 1024 / 1024 > this.MAX_FILESIZE) {

                    return false;
                }

                return this.set("element.icon", thumbnail);
            }

            return false;
        },

        handleUploadSuccess: function (file, res) {

            var browsers = this.Page.findAllComponents("IconBrowser"),
                b = browsers.length - 1;

            if (browsers.length) {

                for (b; b >= 0; b--) {

                    browsers[b].addFileToUploadDirectory({
                        name: res.name,
                        path: res.path,
                        svg: res.svg,
                        size: res.size,
                        width: file.width,
                        height: file.height
                    });
                }
            }

            if (!res.svg) {

                if (file.size > this.MAX_FILESIZE * 1024 * 1024) {

                    this.fire("showDialog", {
                        type: "error",
                        title: "Obrázek nelze použít",
                        text: "Obrázek může být maximálně " + this.MAX_FILESIZE + " MB velký. Velikost vybraného obrázku je " + (file.size / 1024 / 1024).toFixed(2) + " MB.",
                        dismiss: {
                            text: "Zavřít"
                        }
                    });

                    this.set("pulseOutline", false);

                    return;
                }

                this.currentFilePath = encodeURIComponent(res.path);

                if (!this.image) {

                    this.image = new Image();

                    this.image.onload = function () {

                        if (this.torndown) {

                            return;
                        }

                        this.set("element.icon", this.currentFilePath);

                        this.set("pulseOutline", false);

                    }.bind(this);
                }

                this.image.src = this.currentFilePath;

            } else {

                this.set("pulseOutline", false);

                this.set("element.icon", res.svg);
            }
        },

        handleUploadError: function () {

            this.set("pulseOutline", false);

            this.set("element.icon", this.iconBeforeUpload);
        },

        isEmpty: function () {

            return !this.get("element.icon") && !this.get("defaultIcon");
        }
    });

}));

