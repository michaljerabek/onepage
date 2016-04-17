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
            fixed: "P_BackgroundImage__fixed"
        },

        OPTIONS: {
            PARALLAX_MAX_EXT: 320,
            PARALLAX_MIN_EXT: 80,

            EFFECTS_STRENGTH_DEF: 35
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

            this.observe("data.effectsStrength", function (value) {

                var insertedValue = value;

                if (!parseInt(insertedValue) && +insertedValue !== 0) {

                    value = this.OPTIONS.EFFECTS_STRENGTH_DEF;

                } else if (insertedValue < 0) {

                    value = 0;

                } else if (insertedValue > 100) {

                    value = 100;

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

                if (!effects || this.skipEffectsObserver) {

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

                this.set("parallax", !!parallax);
                this.set("fixed", !!fixed);
            });
        },

        onrender: function () {

            if (on.client) {

                this.self = this.find("." + this.CLASS.self);
                this.$self = $(this.self);

                this.PageSection = this.getPageSection();

                this.initParallax();

                if (Ractive.EDIT_MODE) {

                    this.initDragDropUpload();
                }
            }
        },

        initDragDropUpload: function () {

            Dropzone.autoDiscover = false;

            var backgroundImage = this,
                
                prevDisplay,
                prevSrc;

            this.$dropzonePreview = $("<div/>");

            this.dropzone = this.$self.dropzone({
                url: "/upload-background-image",
                paramName: "background-image",

                acceptedFiles: "image/jpg,image/jpeg,image/png",
                maxFilesize: 1,

                clickable: false,

                previewsContainer: this.$dropzonePreview[0],
                thumbnailWidth: null,
                thumbnailHeight: null,

                dictInvalidFileType: "Nepodporovaný formát. Soubor musí být formátu jpg nebo png.",
                dictFileTooBig: "Soubor je příliš velký ({{filesize}} MB). Velikost souboru může být maximálně {{maxFilesize}} MB.",
                dictResponseError: "Soubor se nepodařilo nahrát (chyba: {{statusCode}})",

                addedfile: function () {
                    
                    prevDisplay = backgroundImage.get("data.display");
                    prevSrc = backgroundImage.get("data.src");
                },

                thumbnail: function (file, data) {

                    if (prevSrc === backgroundImage.get("data.src")) {

                        backgroundImage.set("data.src", data);
                    }

                    //je-li obrázek čtverec nebo jsou obě strany menší jak 512px nebo je jedna ze stran
                    //menší jak 128px nebo je poměr stran menší jak 0.4 (= úzký),
                    //pak je obrázek pravděpodobně textura -> nastavit opakování
                    if (file.width === file.height || file.width <= 128 || file.height <= 128 || (file.width <= 512 && file.height <= 512) || file.width / file.height < 0.4) {

                        backgroundImage.set("data.display", "repeat");

                        return;
                    }

                    backgroundImage.set("data.display", "cover");
                },

                sending: function () {
                },

                uploadprogress: function (file, progress) {

                    backgroundImage.fire("progressBarProgress", {
                        id: file.name.replace(".", "_"),
                        progress: progress
                    });
                },

                success: function (file, res) {

                    backgroundImage.set(
                        "data.src",
                        res.path.replace(/^public/, "").replace(/\\/g, "/")
                    );

                    backgroundImage.fire("pageSectionMessage", {
                        title: "Nahrát obrázek",
                        text: "Obrázek (" + file.name + ") se podařilo úspěšně nahrát.",
                        timeout: 2000,
                        status: "success"
                    });
                },

                error: function (file, error) {

                    backgroundImage.fire("progressBarError", {
                        id: file.name.replace(".", "_")
                    });

                    setTimeout(function() {

                        backgroundImage.fire("pageSectionMessage", {
                            title: "Nahrát obrázek",
                            text: error,
                            timeout: 3000,
                            status: "error"
                        });

                    }, 0);

                    if (prevDisplay) {

                        backgroundImage.set("data.display", prevDisplay);
                    }

                    if (prevSrc) {

                        backgroundImage.set("data.src", prevSrc);
                    }
                },

                complete: function () {
                }
            });

            this.dropzone.on("dragenter", function () {

                backgroundImage.fire("pageSectionMessage", {
                    title: "Nahrát obrázek",
                    text: "Maximální velikost souboru: 1 MB. Podporované formáty: jpg, png."
                });
            });

            this.dropzone.on("dragleave dragend drop", function () {

                backgroundImage.fire("pageSectionMessage", null);
            });
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

            clearTimeout(this.sectionChangeThrottle);

            if (this.parallax) {

                this.parallax.destroy();

                this.parallax = null;
            }

            Dropzone.forElement(this.self).destroy();
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
