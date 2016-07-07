/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var FileBrowser = require("./index.js"),

            template = require("./index.tpl");

        module.exports = factory(FileBrowser);

    } else {

        root.FileBrowser = factory(root.FileBrowser);
    }

}(this, function (FileBrowser) {

    return FileBrowser.extend({

        components: {

        },

        partials: {

        },

        data: function () {

            return {
                type: "images",
                browserType: "ImageBrowser",

                //název requestu odesílaného na server
                reqName: "images",

                filesType: this.OPTIONS.FILETYPE_IMAGE,

                uploadDirectory: "Moje obrázky",

                uploadOverlayTitle: "Nahrát obrázky",
                uploadOverlayText: "Maximální velikost souboru: 1 MB. Podporované formáty: .jpg, .png, .svg."
            };
        },

        onconstruct: function () {

            this.superOnconstruct();
        },

        onconfig: function () {

            this.superOnconfig();

            this.OPTIONS.DROPZONE = function () {

                return {
                    url: "/upload-images",
                    paramName: "images",

                    uploadMultiple: true,
                    acceptedFiles: "image/jpg,image/jpeg,image/png",
                    maxFilesize: 1,
                    parallelUploads: 4,

                    clickable: false,

                    thumbnailWidth: 100,
                    thumbnailHeight: 100,

                    dictInvalidFileType: "Nepodporovaný formát. Soubor musí být formátu .jpg nebo .png.",
                    dictFileTooBig: "Soubor je příliš velký ({{filesize}} MB). Velikost souboru může být maximálně {{maxFilesize}} MB.",
                    dictResponseError: "Soubor se nepodařilo nahrát (chyba: {{statusCode}})"
                };
            };
        },

        onrender: function () {

            this.superOnrender();
        },

        oncomplete: function () {

            this.superOncomplete();
        },

        onteardown: function () {

            this.superOnteardown();
        }

    });

}));

