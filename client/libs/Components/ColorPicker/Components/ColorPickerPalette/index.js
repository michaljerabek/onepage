/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),
            Spectra = require("spectra"),
            Vibrant = require("./../../../../VibrantWW/VibrantWW"),
            template = require("./index.tpl"),
            on = require("./../../../../../../helpers/on");

        module.exports = factory(Ractive, Spectra, Vibrant, template, on);

    } else {

        root.ColorPickerPalette = factory(root.Ractive, root.Spectra, root.Vibrant, "", {client: true});
    }

}(this, function (Ractive, Spectra, Vibrant, template, on) {

    var colorCache = {};

    return Ractive.extend({

        template: template,

        noIntro: true,

        data: function () {

            return {
                TYPE_DEFAULT: "default",

                delay: 0,

                colors: [],
                image: "",

                formatColor: function (color, format) {

                    var colorPicker = this.parent.COLOR_PICKER ? this.parent: this.container;

                    if (format === colorPicker.get("TYPE_HEX")) {

                        if (colorPicker.validateHEX(color)) {

                            return color;
                        }

                        return Spectra(color).hex();

                    } else if (format === colorPicker.get("TYPE_RGB")) {

                        if (colorPicker.validateRGB(color)) {

                            return color;
                        }

                        var spectra = Spectra(color);

                        return "rgb(" + spectra.red() + ", " + spectra.green() + ", " + spectra.blue() + ")";
                    }

                    return color;
                }
            };
        },

        computed: {

            nearToBlack: function () {

                var color = Spectra(this.parent.get("current"));

                return color.near(Spectra("black"), 50);
            }
        },

        onconfig: function () {

            if (on.client) {

                this[this.parent.COLOR_PICKER ? "parent" : "container"].observe("inputType", function (value) {

                    this.set("inputType", value);

                }.bind(this));

                if (!this.get("image") && this.get("images")) {

                    this.set("image", this.get("images.0.src"));
                }

                this.observe("image", this.handleImageChange, {init: false});
            }
        },

        oncomplete: function () {

            var image = this.get("image");

            this.observe("lastColors", function (colors, prevColors) {

                if (!colors.length || !prevColors || colors.length < prevColors.length) {

                    return;
                }

                colorCache[this.get("image")] = colors;

            }, {init: false});

            if (on.client && image && image !== "none" && this.get("colors").length < 5) {

                //cross-origin
                if (image.match(/^http/) && !image.match(new RegExp("^" + window.location.origin))) {

                    return;
                }

                this.loadImageTimeout = setTimeout(function() {

                    this.getPaletteFromImage();

                }.bind(this), this.get("delay"));
            }
        },

        onteardown: function () {

            this.stopProcessing();
        },

        stopProcessing: function () {

            if (this.image) {

                this.image.src = "";
                this.image = null;
            }

            this.set("processing", false);

            clearTimeout(this.loadImageTimeout);
            clearTimeout(this.stopVibrantTimeout);
            clearTimeout(this.stopVibrant2Timeout);

            if (this.stopVibrant) {

                this.stopVibrant();

                this.stopVibrant = null;
            }

            if (this.stopVibrant2) {

                this.stopVibrant2();

                this.stopVibrant2 = null;
            }
        },

        handleImageChange:  function (image) {

            if (!image || image === "none") {

                return;
            }

            this.stopProcessing();

            this.set("lastColors", []);

            //cross-origin
            if (image.match(/^http/) && !image.match(new RegExp("^" + window.location.origin))) {

                return;
            }

            this.getPaletteFromImage();
        },

        getUniqueRgbs: function (vibrantPalette) {

            var keys = Object.keys(vibrantPalette),
                c = keys.length - 1,
                rgbs = [];

            for (c; c >= 0; c--) {

                if (vibrantPalette[keys[c]]) {

                    vibrantPalette[keys[c]].rgb[0] = Math.round(vibrantPalette[keys[c]].rgb[0]);
                    vibrantPalette[keys[c]].rgb[1] = Math.round(vibrantPalette[keys[c]].rgb[1]);
                    vibrantPalette[keys[c]].rgb[2] = Math.round(vibrantPalette[keys[c]].rgb[2]);

                    var rgbString = "rgb(" + vibrantPalette[keys[c]].rgb.join(",") + ")";

                    if (!~rgbs.indexOf(rgbString)) {

                        rgbs.push(rgbString);
                    }
                }
            }

            return rgbs;
        },

        findTheLeastSimilarColors: function (rgbs, compareWithRgbs, count) {

            var similarity = {},
                spectraCache = {},

                r = rgbs.length - 1,
                c = compareWithRgbs.length - 1;

            for (r; r >= 0; r--) {

                var spectra = Spectra(rgbs[r]);

                similarity[rgbs[r]] = 0;

                for (c; c >= 0; c--) {

                    var spectra2 = spectraCache[compareWithRgbs[c]] || Spectra(compareWithRgbs[c]);

                    if (!spectraCache[compareWithRgbs[c]]) {

                        spectraCache[compareWithRgbs[c]] = spectra2;
                    }

                    if (spectra.near(spectra2, 5)) {

                        similarity[rgbs[r]] = -100;

                    } else if (spectra.near(spectra2, 10)) {

                        similarity[rgbs[r]] += 3;

                    } else if (spectra.near(spectra2, 20)) {

                        similarity[rgbs[r]] += 2;

                    } else if (spectra.near(spectra2, 30)) {

                        similarity[rgbs[r]] += 1;
                    }
                }

                c = compareWithRgbs.length - 1;
            }

            var sorted = Object.keys(similarity)
                .filter(function (color) {

                    return similarity[color] < 0 ? false : color;

                }).sort(function (a, b) {

                    return similarity[a] - similarity[b];
                });

            return sorted.splice(0, count);
        },

        getPaletteFromImage: function () {

            var src = this.get("image");

            if (src && colorCache[src]) {

                this.merge("colors", Array.prototype.slice.call(colorCache[src]));

                if (colorCache[src].length === 5) {

                    return;
                }
            }

            this.image = new Image();

            this.set("processing", true);

            this.image.onload = function () {

                var vibrant = new Vibrant(this.image, 32, 7);

                this.stopVibrant = vibrant.stop;

                this.stopVibrantTimeout = setTimeout(vibrant.stop, 3000);

                vibrant.promise.then(function (vibrant) {

                    clearTimeout(this.stopVibrantTimeout);

                    var palette = vibrant.swatches(),

                        rgbs = this.getUniqueRgbs(palette);

                    if (rgbs.length < 5) {

                        var vibrant2 = new Vibrant(this.image, 5, 10, true);

                        this.stopVibrant2 = vibrant2.stop;

                        this.stopVibrant2Timeout = setTimeout(vibrant2.stop, 3000);

                        vibrant2.promise.then(function (palette) {

                            clearTimeout(this.stopVibrant2Timeout);

                            var rgbs2 = this.getUniqueRgbs(palette),

                                leastSimilar = this.findTheLeastSimilarColors(rgbs2, rgbs, 5 - rgbs.length),

                                concat = this.get("colors").concat(leastSimilar);

                            this.merge("colors", concat);

                            this.set("lastColors", concat);

                            this.image = null;

                            this.set("processing", false);

                        }.bind(this));

                    } else {

                        this.image = null;

                        this.set("processing", false);
                    }

                    this.merge("colors", rgbs);

                    this.set("lastColors", rgbs);

                    this.set("selectElement", this.find("select"));

                }.bind(this));

            }.bind(this);

            this.image.src = src;

        }
    });

}));
