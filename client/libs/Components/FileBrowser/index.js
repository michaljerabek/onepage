/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
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

}(this, function (Ractive, Dropzone, template) {

    var savedDirectories = {},

        savedSearchText = {};

    return Ractive.extend({

        template: template,

        CLASS: {
            self: "FileBrowser",

            uploadFiles: "FileBrowser--upload-files",

            searchInput: "FileBrowser--search-input"
        },

        OPTIONS: {
            FILETYPE_IMAGE: "image",
            FILETYPE_ICON: "icon" ,

            DROPZONE: function () {

                return {
                    url: "/upload-files",
                    paramName: "files",

                    uploadMultiple: true,
                    acceptedFiles: "",
                    maxFilesize: 1,
                    parallelUploads: 5,

                    clickable: false,

                    thumbnailWidth: 100,
                    thumbnailHeight: 100,

                    dictInvalidFileType: "Nepodporovaný formát.",
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
                type: "default",

                directories: [],
                openDirectory: null,
                loadingDirectory: null,

                //název requestu odesílaného na server
                reqName: "files",

                filesType: "",

                srcPath: window.location.origin,
                thumbsPath: "/thumbs",
                thumbsFullPath: this.getThumbsFullPath,
                selectedPath: "",

                uploadDirectory: "",

                uploadOverlayTitle: "Nahrát soubory",
                uploadOverlayText: "",

                uploading: [],

                showMessage: false,

                saveOnTeardown: true,

                searchable: false,
                searchDirPath: "#search",
                searchPlaceholder: "Najít...",
                searchText: ""
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

            this.observe("openDirectory", this.openDirectory, {init: false});

            this.on("deleteFile", this.deleteFile);

            if (this.get("saveOnTeardown")) {

                this.set("directories", savedDirectories[this.get("reqName")] || []);

                this.set("searchText", savedSearchText[this.get("reqName")] || "");
            }

            if (!this.get("directories").length) {

                this.loadDirectories();
            }

            this.observe("directories.*.files openDirectory", this.hasInitContentOnOpen);

            if (this.get("searchable")) {

                this.observe("searchText", function (searchText) {

                    clearTimeout(this.searchTimeout);

                    this.searchTimeout = setTimeout(
                        this.searchFiles.bind(this, searchText),
                        window.navigator.userAgent.match(/Mobi/) ? 1000 : 500
                    );

                }, {init: false});
            }
        },

        superOnrender: function () {

            this.self = this.find("." + this.CLASS.self);
            this.$self = $(this.self);

            if (this.get("directories").length) {

                this.initUploadFiles();

                this.searchInput = this.find("." + this.CLASS.searchInput);
            }
        },

        superOncomplete: function () {

        },

        superOnteardown: function () {

            this.torndown = true;

            if (this.dirReq) {

                this.dirReq.cancelReq(true);
            }

            if (this.filesReq) {

                this.filesReq.cancelReq(true);
            }

            if (this.searchReq) {

                this.searchReq.cancelReq(true);
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

            //uložit složky pro další instanci (kromě uploadovací složky)
            if (this.get("saveOnTeardown")) {

                var directories = this.get("directories");

                if (this.get("uploadDirectory")) {

                    var directoryIndex = this.getDirectoryIndexByName(this.get("uploadDirectory"));

                    if (~directoryIndex) {

                        directories[directoryIndex].files = [];
                    }
                }

                savedDirectories[this.get("reqName")] = directories;

                savedSearchText[this.get("reqName")] = this.get("searchText");
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

            if (!this.get("uploadDirectory") || this.uploadFilesLoaded) {

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

                if (e.type !== "touchend") {

                    e.preventDefault();
                    return false;
                }
            });

            options.addedfile = this.handleAddedfile.bind(this);

            if (this.handleResize) {

                options.resize = this.handleResize.bind(this);
            }

            if (this.handleThumbnail) {

                options.thumbnail = this.handleThumbnail.bind(this);
            }

            options.uploadprogress = this.handleUploadProgress.bind(this);
            options.successmultiple = this.handleUploadSuccessmultiple.bind(this);
            options.error = this.handleUploadError.bind(this);
            options.complete = this.handleUploadComplete.bind(this);

            this.dropzone = this.$self.dropzone(options);

            this.dropzoneInstance = Dropzone.forElement(this.self);

            this.thumbWidth = options.thumbnailWidth;
            this.thumbHeight = options.thumbnailHeight;

            this.uploadFilesLoaded = true;
        },

        //pokud složka při otevření obsahuje soubory je potřeba použit jinou intro animaci
        hasInitContentOnOpen: function (current, before, path, index) {

            var dirIndex = path === "openDirectory" ? current : +index;

            if (this.skipInitDirContentObserver === dirIndex) {

                return;
            }

            if (path === "openDirectory") {

                this.skipInitDirContentObserver = dirIndex;
            }

            if (dirIndex || dirIndex === 0) {

                this.set("directories." + dirIndex + ".initDirContent", !before || !before.length || path === "openDirectory");
            }

            this.skipInitDirContentObserver = null;
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
                trgWidth: file.width > file.height ? this.thumbWidth : this.thumbWidth * (file.width / file.height),
                trgHeight: file.width > file.height ? this.thumbHeight * (file.height / file.width) : this.thumbHeight
            };
        },

        handleThumbnail: function (file, data) {

            if (this.torndown || !file.accepted) {

                return;
            }

            if (file.fileBrowserId && data) {

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

                        var dataFilePath = "directories." + directoryIndex + ".files." + f;

                        this.set(dataFilePath + ".uploading", false);
                        this.set(dataFilePath + ".uploaded", true);
                        this.set(dataFilePath + ".path", paths.files[p].path.replace(/\\/g, "/").replace(/^public\//g, ""));
                        this.set(dataFilePath + ".name", paths.files[p].name);

                        if (paths.files[p].svg) {

                            this.set(dataFilePath + ".svg", paths.files[p].svg);
                        }
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

                //vytvořit "složku" pro vyhledávání
                if (this.get("searchable")) {

                    res.directories.unshift({
                        name: this.get("searchPlaceholder"),
                        path: this.get("searchDirPath"),
                        files: [],
                        searchDir: true
                    });
                }

                this.set("directories", res.directories);

                setTimeout(function () {

                    this.searchInput = this.find("." + this.CLASS.searchInput);

                    this.initUploadFiles();

                }.bind(this), 0);

            }.bind(this)).catch(function () {});
        },

        loadFilesForDirectory: function (directory, directoryIndex) {

            this.set("loadingDirectory", directoryIndex);

            if (this.filesReq) {

                this.filesReq.cancelReq();
            }

            this.filesReq = this.req(this.get("reqName"), {
                directory: directory.path
            });

            this.filesReq.then(function (res) {

                if (res && res.files) {

                    var f = 0,
                        files = [];

                    for (f; f < res.files.length; f++) {

                        res.files[f].path = res.files[f].path.replace(/\\/g, "/");

                        files.push(res.files[f]);
                    }

                    this.merge("directories." + directoryIndex + ".files", directory.files.concat(files), {compare: "svg"});

                    //odstranit již nahrané soubory - jsou opět načtené ze serveru
                    var inF = directory.files.length - 1;

                    for (inF; inF >= 0; inF--) {

                        if (directory.files[inF].uploaded) {

                            directory.files.splice(inF, 1);
                        }
                    }
                }

                this.set("loadingDirectory", null);

            }.bind(this)).catch(function () {});
        },

        addFileToUploadDirectory: function (name, path) {

            if (path && name) {

                setTimeout(function() {

                    if (this.torndown) {

                        return;
                    }

                    var directoryIndex = this.getDirectoryIndexByName(this.get("uploadDirectory"));

                    if (~directoryIndex) {

                        this.set("directories." + directoryIndex + ".initDirContent", false);

                        this.unshift("directories." + directoryIndex + ".files", {
                            name: name,
                            path: path,
                            uploaded: true
                        });
                    }

                }.bind(this), 1000);
            }
        },

        deleteFile: function (event, file) {

            var index = event.keypath.match(/[0-9]+$/);

            this.splice(event.keypath.replace(/\.[0-9]+$/, ""), index, 1);

            if (file.path) {

                this.req(this.get("reqName") + ".delete", {
                    path: file.path
                }, true);
            }
        },

        openDirectory: function (directoryIndex) {

            this.set("showRemoveConfirmation", null);

            var directory;

            if (directoryIndex || directoryIndex === 0) {

                directory = this.getDirectoryByIndex(directoryIndex);

                //pokud jsou soubory již načteny -> return
                if (directory && directory.files && directory.files.length && !this.directoryHasOnlyUploadedFiles(directoryIndex))  {

                    return;
                }

                this.loadFilesForDirectory(directory, directoryIndex);

            } else {

                this.set("loadingDirectory", null);
            }

            //nastavit/odstranit focus u vyhledávání
            if (this.searchInput) {

                this.searchInput[directory && directory.searchDir ? "focus" : "blur"]();
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

        getDirectoryIndexByPath: function (path) {

            var directories = this.get("directories"),
                d = directories.length - 1;

            for (d; d >= 0; d--) {

                if (directories[d].path === path) {

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
        },

        searchFiles: function (searchText) {

            if (this.searchReq) {

                this.searchReq.cancelReq(true);
            }

            if (!searchText || searchText.length < 2) {

                var directoryIndex = this.getDirectoryIndexByPath(this.get("searchDirPath"));

                this.set("directories." + directoryIndex + ".files", []);

                return;
            }

            this.set("searching", true);

            this.searchReq = this.req(this.get("reqName") + ".search", {search: searchText});

            this.searchReq.then(function (result) {

                if (result && result.files) {

                    var directoryIndex = this.getDirectoryIndexByPath(this.get("searchDirPath"));

                    this.merge("directories." + directoryIndex + ".files", result.files, {compare: true});

                    this.set("directories." + directoryIndex + ".initDirContent", false);
                }

                this.set("searching", null);

            }.bind(this)).catch(function () {

                this.set("searching", null);

            }.bind(this));
        }
    });

}));

