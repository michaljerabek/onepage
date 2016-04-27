/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var FileBrowser = require("./index.js");

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

                type: "icon",

                //název requestu odesílaného na server
                reqName: "icons",

                filesType: this.OPTIONS.FILETYPE_ICON,

                uploadDirectory: "Moje ikony",

                uploadOverlayTitle: "Nahrát ikony",
                uploadOverlayText: "Maximální velikost souboru: 64 KB. Podporované formáty: .png, .svg.",

                searchable: true
            };
        },

        onconstruct: function () {

            this.superOnconstruct();
        },

        onconfig: function () {

            this.superOnconfig();

            this.OPTIONS.DROPZONE = function () {

                return {
                    url: "/upload-icons",
                    paramName: "icons",

                    uploadMultiple: true,
                    acceptedFiles: "image/png,image/svg+xml",
                    maxFilesize: 0.064,
                    parallelUploads: 8,

                    clickable: false,

                    thumbnailWidth: 40,
                    thumbnailHeight: 40,

                    dictInvalidFileType: "Nepodporovaný formát. Soubor musí být formátu png nebo svg.",
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

