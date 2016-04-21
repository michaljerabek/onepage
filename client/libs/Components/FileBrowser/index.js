/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),
            on = require("./../../../../helpers/on"),

            Dropzone = on.client ? require("dropzone") : function () { return {}; },

            template = require("./index.tpl");

        module.exports = factory(Ractive, Dropzone, template, on);

    } else {

        root.FileBrowser = factory(root.Ractive, root.Dropzone, "", {client: true});
    }

}(this, function (Ractive, Dropzone, template, on) {

    return Ractive.extend({

        template: template,

        CLASS: {
            self: "FileBrowser",

            uploadFiles: "FileBrowser--upload-files"
        },

        OPTIONS: {
            TYPE_IMAGE: "image",
            TYPE_SVG: "SVG" ,

            DROPZONE: function () {

                return {
                    url: "/upload-background-images",
                    paramName: "background-images",

                    uploadMultiple: true,
                    acceptedFiles: "image/jpg,image/jpeg,image/png",
                    maxFilesize: 1,
                    parallelUploads: 5,

                    clickable: false,

                    thumbnailWidth: 100,
                    thumbnailHeight: 100,

                    dictInvalidFileType: "Nepodporovaný formát. Soubor musí být formátu jpg nebo png.",
                    dictFileTooBig: "Soubor je příliš velký ({{filesize}} MB). Velikost souboru může být maximálně {{maxFilesize}} MB.",
                    dictResponseError: "Soubor se nepodařilo nahrát (chyba: {{statusCode}})"
                };
            }
        },

        components: {

        },

        partials: {

        },

        data: function () {

            return {
//              directories: [
//                  {
//                      name: "Složka 1",
//                      files: [
//                          {
//                              name: "Soubor 1"
//                          }
//                      ]
//                  }
//              ]
                directories: [],
                openDirectory: null,
                loadingDirectory: null,

                //název requestu odesílaného na server
                reqName: "images",

                filesType: this.OPTIONS.TYPE_IMAGE,

                srcPath: window.location.origin,
                thumbsPath: "/thumbs",
                thumbsFullPath: this.getThumbsFullPath,

                uploadDirectory: "Moje obrázky",

                uploadOverlayTitle: "Nahrát soubory",
                uploadOverlayText: "Maximální velikost souboru: 1 MB. Podporované formáty: jpg, png.",

                uploading: [],

                showMessage: false
            };
        },

        superOnconstruct: function () {

            if (!window.location.origin) {

                window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port: "");
            }
        },

        onconstruct: function () {

            this.superOnconstruct();
        },

        superOnconfig: function () {

            this.loadDirectories();

            this.observe("openDirectory", this.openDirectory, {init: false});

            this.on("deleteFile", this.deleteFile);
        },

        superOnrender: function () {

            this.self = this.find("." + this.CLASS.self);
            this.$self = $(this.self);
        },

        superOncomplete: function () {

        },

        superOnteardown: function () {

            this.torndown = true;

            this.dirReq.cancelReq(true);

            if (this.imageReq) {

                this.imageReq.cancelReq(true);
            }

            if (this.dropzone) {

                this.dropzone.off("*");

                this.dropzoneInstance.removeAllFiles(true);
                this.dropzoneInstance.destroy();

                this.$dropzonePreview.remove();
                this.$dropzonePreview = null;

                this.$dropzoneClickable.off(".FileBrowser");
            }

            if (this.uploadErrorRemovingFnTimeouts) {

                var t = this.uploadErrorRemovingFnTimeouts.length - 1;

                for (t; t >= 0; t--) {

                    clearTimeout(this.uploadErrorRemovingFnTimeouts[t]);
                }
            }
        },

        onconfig: function () {

            this.superOnconfig();
        },

        onrender: function () {

            this.superOnrender();
        },

        oncomplete: function () {

            this.superOncomplete();
        },

        onteardown: function () {

            this.superOnteardown();
        },

        initUploadFiles: function () {

            if (!this.get("uploadDirectory")) {

                return;
            }

            Dropzone.autoDiscover = false;

            var options = this.OPTIONS.DROPZONE();

            //element pro uložení náhledů (nelze v Dropzone zrušit)
            this.$dropzonePreview = $("<div/>");
            options.previewsContainer = this.$dropzonePreview[0];

            options.clickable = this.find("." + this.CLASS.uploadFiles);

            this.$dropzoneClickable = $(options.clickable);

            this.$dropzoneClickable.on("mousedown.FileBrowser touchend.FileBrowser", function (e) {

                e.stopPropagation();
                e.preventDefault();
                return false;
            });

            options.addedfile = this.handleAddedfile.bind(this);
            options.resize = this.handleResize.bind(this);
            options.thumbnail = this.handleThumbnail.bind(this);
            options.uploadprogress = this.handleUploadProgress.bind(this);
            options.successmultiple = this.handleUploadSuccessmultiple.bind(this);
            options.error = this.handleUploadError.bind(this);
            options.complete = this.handleUploadComplete.bind(this);

            this.dropzone = this.$self.dropzone(options);

            this.dropzoneInstance = Dropzone.forElement(this.self);
        },

        handleAddedfile: function (file) {

            if (this.torndown) {

                return;
            }

            var uploadDirectory = this.getDirectoryByName(this.get("uploadDirectory"));

            if (uploadDirectory.uploadable && uploadDirectory.files) {

                this.fileUploadCounter = !this.fileUploadCounter ? 1 : this.fileUploadCounter + 1;

                uploadDirectory.files.unshift({
                    name: file.name,
                    uploading: true,
                    uploadingId: this.fileUploadCounter,
                    file: file
                });

                file.fileBrowserId = this.fileUploadCounter;
            }

            this.push("uploading", file);
        },

        handleResize: function (file) {

            if (this.torndown) {

                return;
            }

            return {
                srcY: 0,
                srcX: 0,
                srcWidth: file.width,
                srcHeight: file.height,
                trgWidth: file.width > file.height ? 100 : 100 * (file.width / file.height),
                trgHeight: file.width > file.height ? 100 * (file.height / file.width) : 100
            };
        },

        handleThumbnail: function (file, data) {

            if (this.torndown) {

                return;
            }

            if (file.fileBrowserId) {

                var directoryIndex = this.getDirectoryIndexByName(this.get("uploadDirectory")),
                    fileIndex = this.getFileIndexByUploadingId(file.fileBrowserId);

                this.set("directories." + directoryIndex + ".files." + fileIndex + ".preview", data);
            }
        },

        handleUploadProgress: function (file, progress) {

            if (this.torndown) {

                return;
            }

            this.fire(this.get("progressBarId") + "ProgressBarProgress", {
                id: file.name.replace(".", "_"),
                progress: progress
            });
        },

        handleUploadSuccessmultiple: function (files, paths) {

            if (this.torndown) {

                return;
            }

            var directoryIndex = this.getDirectoryIndexByName(this.get("uploadDirectory")),
                filesInDir = this.get("directories." + directoryIndex + ".files"),
                p,
                f = filesInDir.length - 1;

            for (f; f >= 0; f--) {

                p = paths.files.length - 1;

                for (p; p >= 0; p--) {

                    if (filesInDir[f].name === paths.files[p].originalname) {

                        this.set("directories." + directoryIndex + ".files." + f + ".uploading", false);
                        this.set("directories." + directoryIndex + ".files." + f + ".path", paths.files[p].path.replace(/\\/g, "/").replace(/^public\//g, ""));
                        this.set("directories." + directoryIndex + ".files." + f + ".name", paths.files[p].name);
                    }
                }
            }
        },

        handleUploadError: function (file, error) {

            if (this.torndown) {

                return;
            }

            if (file.fileBrowserId) {

                var directoryIndex = this.getDirectoryIndexByName(this.get("uploadDirectory")),
                    fileIndex = this.getFileIndexByUploadingId(file.fileBrowserId);

                this.set("directories." + directoryIndex + ".files." + fileIndex + ".uploadError", error);
                this.set("directories." + directoryIndex + ".files." + fileIndex + ".uploading", false);

                //odstranit chybné soubory ze složky
                this.uploadErrorRemovingFnTimeouts = this.uploadErrorRemovingFnTimeouts || [];

                this.uploadErrorRemovingFnTimeouts.push(setTimeout(function () {

                    var directoryIndex = this.getDirectoryIndexByName(this.get("uploadDirectory")),
                        fileIndex = this.getFileIndexByUploadingId(file.fileBrowserId);

                    if (fileIndex >= 0) {

                        this.splice("directories." + directoryIndex + ".files", fileIndex, 1);
                    }

                }.bind(this), directoryIndex === this.get("openDirectory") ? 2000 : 0));
            }

            this.fire(this.get("progressBarId") + "ProgressBarError", {
                id: file.name.replace(".", "_")
            });

            this.showMessage(file.name, "Soubor se nepodařilo nahrát: " + error);
        },

        handleUploadComplete: function (file) {

            if (this.torndown) {

                return;
            }

            this.removeFileFromUploading(file);
        },

        removeFileFromUploading: function (file) {

            var files = this.get("uploading"),
                f = files.length - 1;

            for (f; f >= 0; f--) {

                if (files[f] === file) {

                    return this.splice("uploading", f, 1);
                }
            }
        },

        loadDirectories: function () {

            this.dirReq = this.req(this.get("reqName") + ".dirs");

            this.dirReq.then(function (res) {

                var d = res.directories.length - 1;

                for (d; d >= 0; d--) {

                    res.directories[d].files = [];
                }

                this.set("directories", res.directories);

                setTimeout(this.initUploadFiles.bind(this), 0);

            }.bind(this));
        },

        loadFilesForDirectory: function (directory) {

            if (this.imageReq) {

                this.imageReq.cancelReq();
            }

            this.imageReq = this.req(this.get("reqName"), {
                directory: directory.path
            });

            this.imageReq.then(function (res) {

                if (res && res.files) {

                    var f = res.files.length - 1;

                    for (f; f>= 0; f--) {

                        res.files[f].path = res.files[f].path.replace(/\\/g, "/");

                        directory.files.unshift(res.files[f]);
                    }
                }

                this.set("loadingDirectory", null);

            }.bind(this));
        },

        addFileToUploadDirectory: function (name, path) {

            if (path && name) {

                setTimeout(function() {

                    if (this.torndown) {

                        return;
                    }

                    var directoryIndex = this.getDirectoryIndexByName(this.get("uploadDirectory"));

                    if (~directoryIndex) {

                        this.unshift("directories." + directoryIndex + ".files", {
                            name: name,
                            path: path
                        });
                    }

                }.bind(this), 1000);
            }
        },

        deleteFile: function (event, path) {

            var index = event.keypath.match(/[0-9]+$/);

            this.splice(event.keypath.replace(/\.[0-9]+$/, ""), index, 1);

            if (path) {

                this.req(this.get("reqName") + ".delete", {
                    path: path
                }, true);
            }
        },

        openDirectory: function (directoryIndex) {

            this.set("showRemoveConfirmation", null);

            if (directoryIndex || directoryIndex === 0) {

                var directory = this.getDirectoryByIndex(directoryIndex),
                    files = [];

                if (directory && directory.files && directory.files.length && !this.directoryHasOnlyUploadedFiles(directoryIndex))  {

                    return;
                }

                this.set("loadingDirectory", directoryIndex);

                this.set("directories." + directoryIndex + ".files", this.get("directories." + directoryIndex + ".files").concat(files));

                this.loadFilesForDirectory(directory);
            }
        },

        directoryHasOnlyUploadedFiles: function (directoryIndex) {

            var files = this.get("directories." + directoryIndex + ".files"),
                f = files.length - 1;

            for (f; f >= 0; f--) {

                if (typeof files[f].uploading === "undefined" && typeof files[f].uploaded === "undefined") {

                    return false;
                }
            }

            return true;
        },

        getDirectoryByIndex: function (index) {

            return this.get("directories." + index);
        },

        getDirectoryByName: function (name) {

            var directories = this.get("directories"),
                d = directories.length - 1;

            for (d; d >= 0; d--) {

                if (directories[d].name === name) {

                    return directories[d];
                }
            }

            return null;
        },

        getDirectoryIndexByName: function (name) {

            var directories = this.get("directories"),
                d = directories.length - 1;

            for (d; d >= 0; d--) {

                if (directories[d].name === name) {

                    return d;
                }
            }

            return -1;
        },

        getDirectoryByPath: function (path) {

            var directories = this.get("directories"),
                d = directories.length - 1;

            for (d; d >= 0; d--) {

                if (directories[d].path === path) {

                    return directories[d];
                }
            }

            return null;
        },

        getFileIndexByUploadingId: function (id) {

            var uploadDirectory = this.getDirectoryByName(this.get("uploadDirectory")),

                files = uploadDirectory.files,
                f = files.length - 1;

            for (f; f >= 0; f--) {

                if (files[f].uploadingId === id) {

                    return f;
                }
            }

            return -1;
        },

        getThumbsFullPath: function (path) {

            var srcPath = this.get("srcPath").replace(/\/$/, ""),
                thumbsPath = this.get("thumbsPath").replace(/^\/|\/$/, "");

            thumbsPath = thumbsPath ? "/" + thumbsPath + "/" : "/";

            return [
                srcPath, "/",
                path.replace(/^\/|\/$/, "")
                    .replace(/\/([^\/]*)$/, thumbsPath + "$1")
            ].join("");
        },

        showMessage: function (title, text, hideTimeout) {

            this.set("messageTitle", title);
            this.set("messageText", text);

            this.set("showMessage", true);

            clearTimeout(this.hideMessageTimeout);

            this.hideMessageTimeout = setTimeout(this.set.bind(this, "showMessage", false), hideTimeout || 3000);
        }
    });

}));

