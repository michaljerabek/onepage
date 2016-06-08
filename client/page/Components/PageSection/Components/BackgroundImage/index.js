/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var on = require("./../../../../../../helpers/on");
        var EventEmitter = require("./../../../../../libs/EventEmitter")();

        var Ractive = require("ractive"),

            Dropzone = on.client ? require("dropzone") : function () { return {}; },

            Parallax = require("./Parallax"),

            template = require("./index.tpl");

        module.exports = factory(Ractive, Dropzone, Parallax, template, on);

    } else {

        root.BackgroundImage = factory(root.Ractive, root.Dropzone, root.Parallax, null, {client: true});
    }

}(this, function (Ractive, Dropzone, Parallax, template, on) {

    return Ractive.extend({

        template: template || "",

        CLASS: {
            self: "P_BackgroundImage",

            image: "P_BackgroundImage--image",

            parallax: "P_BackgroundImage__parallax",
            fixed: "P_BackgroundImage__fixed",

            notFileDragged: "dz-not-file"
        },

        OPTIONS: {
            PARALLAX_MAX_EXT: 320,
            PARALLAX_MIN_EXT: 80,

            EFFECTS_STRENGTH_DEF: 35,

            DROPZONE: function () {

                return {
                    url: "/upload-image",
                    paramName: "image",

                    acceptedFiles: "image/jpg,image/jpeg,image/png",
                    maxFilesize: 1,
                    uploadMultiple: false,

                    clickable: false,

                    thumbnailWidth: null,
                    thumbnailHeight: null,

                    dictInvalidFileType: "Nepodporovaný formát. Soubor musí být formátu .jpg, .png.",
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
                editMode: Ractive.EDIT_MODE,

                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",

                parallax: false,
                parallaxExtention: this.getParallaxExtention(this.OPTIONS.EFFECTS_STRENGTH_DEF),
                fixed: false,

                data: {
                    src: "",

                    display: "cover",
                    effects: [],
                    effectsStrength: this.OPTIONS.EFFECTS_STRENGTH_DEF
                }
            };
        },

        onconfig: function () {

            this.observe("data.src", function (src) {

                if (!src) {

                    this.set("parallax", false);
                    this.set("fixed", false);

                } else {

                    this.update("data.effects");
                }

            }, {init: false});

            this.observe("data.effectsStrength", function (value) {

                if (typeof value === "undefined") {

                    return;
                }

                var insertedValue = value;

                if (!parseInt(insertedValue) && +insertedValue !== 0) {

                    value = this.OPTIONS.EFFECTS_STRENGTH_DEF;

                } else {

                    value = Math.max(Math.min(100, insertedValue), 0);

                }

                if (value !== insertedValue) {

                    this.set("data.effectsStrength", value);
                }

                this.set("parallaxExtention", this.getParallaxExtention(value));
            });

            this.observe("data.display", function (display) {

                switch (display) {

                    case "cover": {

                        this.set("backgroundSize", "cover");
                        this.set("backgroundRepeat", "no-repeat");

                        break;
                    }

                    case "repeat": {

                        this.set("backgroundSize", "auto");
                        this.set("backgroundRepeat", "repeat");

                        break;
                    }
                }
            });

            this.observe("data.effects", function (effects) {

                if (this.torndown) {

                    return;
                }

                if (!effects || this.skipEffectsObserver || this.torndown) {

                    return;
                }

                var parallax = ~effects.indexOf("parallax"),
                    fixed = ~effects.indexOf("fixed");

                this.skipEffectsObserver = true;

                //uživatel přepnul na parallax -> zrušit fixed, pokud byl nastaven
                if (parallax && fixed && !this.get("parallax")) {

                    fixed = false;

                    this.splice("data.effects", fixed, 1);

                //uživatel přepnul na fixed -> zušit parallax, pokud byl nastaven
                } else if (parallax && fixed && !this.get("fixed")) {

                    parallax = false;

                    this.splice("data.effects", parallax, 1);
                }

                this.skipEffectsObserver = false;

                if (!this.get("data.src")) {

                    return;
                }

                this.set("parallax", !!parallax);
                this.set("fixed", !!fixed);
            });

        },

        onrender: function () {

            if (on.client) {

                this.self = this.find("." + this.CLASS.self);
                this.$self = $(this.self);

                this.PageSection = this.getPageSection();
                this.Page = this.findParent("Page");

                this.initParallax();

                if (Ractive.EDIT_MODE) {

                    this.initDragDropUpload();

                    this.PageSection.on("BackgroundImageBrowser.selectFile", function (e, file) {

                        this.guessDisplayFromSize(file);

                    }.bind(this));

                    this.Page.on("BackgroundImageBrowser.deleteFile", function (e, file) {

                        var src = this.get("data.src");

                        if (src && file.path.replace(/^\//, "") === src.replace(/^\//, "")) {

                            this.set("data.src", "");
                        }

                    }.bind(this));
                }
            }
        },

        guessDisplayFromSize: function (file) {

            if (file && file.width && file.height) {

                //je-li obrázek čtverec nebo jsou obě strany menší jak 512px nebo je jedna ze stran
                //menší jak 128px nebo je poměr stran menší jak 0.4 (= úzký),
                //pak je obrázek pravděpodobně textura -> nastavit opakování
                if (file.width === file.height || file.width <= 128 || file.height <= 128 || (file.width <= 512 && file.height <= 512) || file.width / file.height < 0.4) {

                    this.set("data.display", "repeat");

                    return;
                }

                this.set("data.display", "cover");
            }
        },

        initDragDropUpload: function () {

            Dropzone.autoDiscover = false;

            var options = this.OPTIONS.DROPZONE();

            //element pro uložení náhledů (nelze v Dropzone zrušit)
            this.$dropzonePreview = $("<div/>");
            options.previewsContainer = this.$dropzonePreview[0];

            options.addedfile = this.handleAddedfile.bind(this);
            options.thumbnail = this.handleThumbnail.bind(this);
            options.uploadprogress = this.handleUploadProgress.bind(this);
            options.success = this.handleUploadSuccess.bind(this);
            options.error = this.handleUploadError.bind(this);

            this.dropzone = this.$self.dropzone(options);

            this.dropzone.on("dragenter", function (event) {

                if (!event.originalEvent.dataTransfer.types[0] ||
                    !event.originalEvent.dataTransfer.types[0].match(/file/i)) {

                    event.target.classList.add(this.CLASS.notFileDragged);

                    return;
                }

                event.target.classList.remove(this.CLASS.notFileDragged);

                this.fire("pageSectionMessage", {
                    title: "Nahrát obrázek",
                    text: "Maximální velikost souboru: " + options.maxFilesize + " MB. Podporované formáty: .jpg, .png."
                });

            }.bind(this));

            this.dropzone.on("dragleave dragend", function () {

                this.fire("pageSectionMessage", null);

            }.bind(this));
        },

        handleAddedfile: function () {

            //uložit původní nastavení, kdyby se nepodařilo obrázek nahrát (-> vrátit)
            this.prevDisplay = this.get("data.display");
            this.prevSrc = this.get("data.src");

            this.fire("pageSectionMessage", {
                title: "Nahrát obrázek",
                text: "Počkejte prosím...",
                status: "info"
            });
        },

        handleThumbnail: function (file, imageData) {

            if (this.torndown || !file.accepted) {

                return;
            }

            //obrázek by se mohl nahrát dříve než se vytvoří thumnail -> zkontrolovat, jestli už obrázek nebyl nahrazen
            if (this.prevSrc === this.get("data.src")) {

                this.set("data.src", imageData);
            }

            this.guessDisplayFromSize(file);
        },

        handleUploadProgress: function (file, progress) {

            if (this.torndown) {

                return;
            }

            this.fire("progressBarProgress", {
                id: file.name.replace(".", "_"),
                progress: progress
            });

            this.fire("pageSectionMessage", {
                title: "Soubor se nahrává...",
                text: progress.toFixed() + " %",
                status: "info"
            });
        },

        handleUploadSuccess: function (file, res) {

            var path = res.path.replace(/^public/, "").replace(/\\/g, "/");
            
            this.set("data.src", path);

            this.fire("pageSectionMessage", {
                title: "Nahrát obrázek",
                text: "Obrázek (" + file.name + ") se podařilo úspěšně nahrát.",
                timeout: 2000,
                status: "success"
            });
            
            var browsers = this.Page.findAllComponents("BackgroundImageBrowser"),
                b = browsers.length - 1;
            
            if (browsers.length) {
                
                for (b; b >= 0; b--) {

                    browsers[b].addFileToUploadDirectory(res.name, path);
                }
            }
        },

        handleUploadError: function (file, error) {

            if (this.torndown) {

                return;
            }

            var errorText = error === "MAX_STORAGE" ? "Soubor " + file.name + " se nepodařilo nahrát. Váš prostor pro data je plný." : error;

            this.fire("progressBarError", {
                id: file.name.replace(".", "_")
            });

            this.fire("pageSectionMessage", {
                title: "Nahrát obrázek",
                text: errorText,
                timeout: 3000,
                status: "error"
            });

            if (this.prevDisplay) {

                this.set("data.display", this.prevDisplay);
            }

            if (this.prevSrc || this.prevSrc === "") {

                this.set("data.src", this.prevSrc);
            }
        },

        initParallax: function () {

            this.observe("parallax", function () {

                if (this.PageSection.get("isRemoved")) {

                    clearTimeout(this.sectionChangeThrottle);

                    if (this.parallax) {

                        this.parallax.destroy();

                        this.parallax = null;
                    }

                    return;
                }

                if (this.torndown) {

                    return;
                }

                if (this.get("parallax")) {

                    if (this.parallax) {

                        return this.parallax.refresh();
                    }

                    this.parallax = new Parallax(this);

                    return;
                }

                if (!this.get("parallax") && this.parallax) {

                    this.parallax.destroy();
                }

            }, {defer: true});

            this.PageSection.observe("section", this.handleSectionChange.bind(this), {init: false, defer: true});
            this.PageSection.on("sectionOrderChanged", this.handleSectionChange.bind(this), {init: false, defer: true});
        },

        onteardown: function () {

            this.torndown = true;

            clearTimeout(this.sectionChangeThrottle);

            if (this.dropzone) {

                this.dropzone.off("dragenter dragleave dragend drop");

                Dropzone.forElement(this.self).removeAllFiles(true);
                Dropzone.forElement(this.self).destroy();

                this.$dropzonePreview.remove();
                this.$dropzonePreview = null;
            }

            if (this.parallax) {

                this.parallax.destroy();

                this.parallax = null;
            }
        },

        getParallaxExtention: function (strength) {

            var range = this.OPTIONS.PARALLAX_MAX_EXT - this.OPTIONS.PARALLAX_MIN_EXT;

            return (range * (strength / 100)) + this.OPTIONS.PARALLAX_MIN_EXT;
        },

        handleSectionChange: function () {

            clearTimeout(this.sectionChangeThrottle);

            this.sectionChangeThrottle = setTimeout(function() {

                if (this.parallax && this.get("parallax")) {

                    this.parallax.refresh();
                }
            }.bind(this), 350);
        }
    });

}));
