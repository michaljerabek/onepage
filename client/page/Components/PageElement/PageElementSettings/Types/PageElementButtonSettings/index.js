/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $, FormData*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var PageElementSettings = require("./../../../PageElementSettings"),

            template = require("./index.tpl");

        module.exports = factory(PageElementSettings, template);

    } else {

        root.ColorSettings = factory(root.PageElementSettings, "");
    }

}(this, function (PageElementSettings, template) {

    return PageElementSettings.extend({

        components: {
        },

        partials: {
            pageElementSettingsContent: template
        },

        data: function () {

            return {
                openTab: "color",
                settingsTitle: "Nastavení tlačítka",

                files: []
            };
        },

        onrender: function () {

            this.superOnrender();
        },

        onconfig: function () {

            this.superOnconfig();

            this.CLASS.fileButton = "E_PageElementButtonSettings--file-button";

            this.Page = this.findParent("Page");

            this.set("image", this.PageSection.get("section.backgroundImage.src"));

            this.set("mostUsedColors", this.Page.findMostUsedColors());
            this.set("sectionsBgImages", this.Page.findSectionsBgImages());

            this.observe("data.scrollToSection", function (value) {

                if (value) {

                    this.set("data.download", false);
                }

            }, {init: false});

            this.observe("data.addToCart", function (value) {

                if (value) {

                    this.set("data.download", false);
                }

            }, {init: false});

            this.observe("data.download", function (value) {

                if (value) {

                    this.set("data.scrollToSection", false);
                    this.set("data.addToCart", false);
                }

            }, {init: false});

            this.on("uploadFile", this.handleUploadFileByButton);

            this.observe("data.type", function (type) {

                if (type === "button") {

                    this.fire("loadFiles", this.addFiles.bind(this));
                }
            });

            this.observe("data.fill", function (state) {

                if (!state && this.get("openTab") === "userTextColor") {

                    this.set("openTab", "color");
                }

            }, {init: false});
        },

        addFiles: function () {

            var files = this.Page.get("page.files"),

                f = (files || []).length - 1,

                _files = [];

            for (f; f >= 0; f--) {

                _files.unshift({
                    text: files[f].name.replace(/^[0-9]+-/, ""),
                    value: files[f].path
                });
            }

            this.set("files", _files);
        },

        handleFileButtonSuccess: function (data) {

            if (this.torndown) {

                return;
            }

            if (this.$fileInput) {

                this.$fileInput[0].value = null;
            }

            this.fire("fileUploaded", data);

            this.unshift("files", {
                text: data.originalname,
                value: data.path.replace(/^(?:\\|\/)?public/, "")
            });

            this.set("fileButtonType", "ok");
            this.set("fileButtonState", "active");
            this.set("fileButtonProgress", "");

            this.resetFileButton();

            this.set("data.type", "button");

            this.set("data.file", data.path.replace(/^(?:\\|\/)?public/, ""));
            this.set("data.download", true);

            this.uploading = false;
        },

        handleFileButtonError: function (file, error) {

            if (!this.torndown) {

                if (this.$fileInput) {

                    this.$fileInput[0].value = null;
                }

                this.set("fileButtonType", "danger");
                this.set("fileButtonState", "active");
                this.set("fileButtonProgress", "");

                this.resetFileButton();

                this.uploading = false;

                var errorText = error && error.responseText && error.responseText === "MAX_STORAGE" ? " Váš prostor pro data je plný." : "";

                this.fire("showDialog", {
                    title: "Nahrát soubor",
                    text: "Soubor " + file.name + " se nepodařilo nahrát." + errorText,
                    dismiss: {
                        text: "Zavřit"
                    }
                });
            }
        },

        handleFileButtonProgress: function(e) {

            if (this.torndown) {

                return;
            }

            if (e.lengthComputable) {

                var percentComplete = e.loaded / e.total;
                percentComplete = parseInt(percentComplete * 100);

                this.set("fileButtonProgress", percentComplete);
            }
        },

        resetFileButton: function (timeout) {

            clearTimeout(this.resetFileButtonTimeout);

            this.resetFileButtonTimeout = setTimeout(function() {

                this.set("fileButtonType", "default");
                this.set("fileButtonState", "");
                this.set("fileButtonProgress", "");

            }.bind(this), timeout || 5000);
        },

        oncomplete: function () {

            this.superOncomplete();
        },

        onteardown: function () {

            this.torndown = true;

            if (this.fileReq) {

                this.fileReq.cancelReq(true);
            }

            if (this.uploadFileXHR) {

                this.uploadFileXHR.abort();
            }

            this.superOnteardown();

            if (this.$fileInput) {

                this.$fileInput.off("change");
            }

            clearTimeout(this.resetFileButtonTimeout);
        },

        handleUploadFileByButton: function (e, inputId) {

            if (this.uploading) {

                return;
            }

            this.set("fileButtonType", "default");
            this.set("fileButtonState", "");

            this.$fileInput = $(inputId);

            this.$fileInput
                .off("change")
                .one("change", this.processUploadReqByButton.bind(this))
                .click();
        },

        processUploadReqByButton: function (e) {

            this.uploading = true;

            var files = e.target.files,

                file, f = 0;

            if (files.length > 0){

                var formData = new FormData();

                for (f; f < files.length; f++) {

                    file = files[f];

                    formData.append("file", file, file.name);
                }

                if (file.size > 1024 * 1024 * this.parent.MAX_FILESIZE) {

                    this.uploading = false;

                    this.fire("showDialog", {
                        title: "Nahrát soubor",
                        text: "Soubor " + file.name + " se nepodařilo nahrát. Soubor je příliš velký (" + (file.size/1024/1024).toFixed(2) + " MB), velikost souboru může být maximálně " + this.parent.MAX_FILESIZE + " MB.",
                        dismiss: {
                            text: "Zavřit"
                        }
                    });

                    return;
                }

                $.ajax({
                    url: "/upload-file",
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,

                    success: this.handleFileButtonSuccess.bind(this),
                    error: this.handleFileButtonError.bind(this, file),

                    xhr: function () {

                        var xhr = new XMLHttpRequest();

                        this.uploadFileXHR = xhr;

                        this.set("fileButtonType", "warn");
                        this.set("fileButtonState", "active");

                        xhr.upload.addEventListener("progress", this.handleFileButtonProgress.bind(this), false);

                        return xhr;

                    }.bind(this)
                });
            }
        },

        getSections: function () {

            var lang = this.Page.get("page.lang"),

                sections = [];

            this.Page.forEachPageSection(function () {

                sections.unshift({
                    text:  this.get("section.name." + lang),
                    value: this.get("section.internalId")
                });

            });

            return sections;
        }
    });

}));

