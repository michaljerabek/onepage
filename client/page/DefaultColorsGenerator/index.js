/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

var Spectra = require("spectra");

var BLACK  = new Spectra("#000"),
    BLACK2 = new Spectra("#222"),
    BLACK3 = new Spectra("#424242"),
    WHITE  = new Spectra("#fff"),
    WHITE2 = new Spectra("#f0f0f0"),
    WHITE3 = new Spectra("#e2e2e2"),

    WHITE_INDEX  = -2,
    WHITE2_INDEX = -3,
    WHITE3_INDEX = -4,
    BLACK_INDEX  = -5,
    BLACK2_INDEX = -6,
    BLACK3_INDEX = -7,

    MIN_BLACK = 68,
    MIN_WHITE = 224,
    MAX_DIFF  = 9,

    TEXT_COLOR_MIN_CONTRAST       = 9,
    COLOR_TEXT_COLOR_MIN_CONTRAST = 6,
    SPECIAL_COLOR_MIN_CONTRAST    = 5,

    getRgbString = function (color) {
        return  "rgb(" + color.red() + ", " + color.green() + ", " + color.blue() + ")";
    },

    getLuminance = function (color) {

        var rgba = [
                color.color.r,
                color.color.g,
                color.color.b
            ],

            i = 0;

        for (i; i < 3; i++) {

            var rgb = rgba[i];

            rgb /= 255;

            rgb = rgb < 0.03928 ? rgb / 12.92 : Math.pow((rgb + 0.055) / 1.055, 2.4);

            rgba[i] = rgb;
        }

        return 0.2126 * rgba[0] + 0.7152 * rgba[1] + 0.0722 * rgba[2];
    },

    calcContrastRatio = function (color1, color2) {

        var l1 = getLuminance(color1) + 0.05,
            l2 = getLuminance(color2) + 0.05,

            ratio = l1 / l2;

        if (l2 > l1) {

            ratio = 1 / ratio;
        }

        return Math.round(ratio * 100) / 100;
    },

    //najde barvu s dostatečným kontrastem k dané barvě (i)
    //minContrast (number) + random (number) se použijí pro "náhodné" vyhledledání barvy, která má dostatečný kontrast
    //fn (<- boolean) slouží k určení, jestli se má nalezená barva použít (true)
    findColorWithGoodContrast = function (i, colors, minContrast, random, fn) {

        var c2 = colors.length - 1,

            contrast = 0,
            colorIndex = -1,

            goodContrastColorsCount = 0;

        for (c2; c2 >= 0; c2--) {

            if (i !== c2 && c2 !== colors.length - 1) {

                if (!fn || fn.call(this, i, c2)) {

                    contrast = this.currentPalette.colors[i]["contrastWith" + c2];
                    colorIndex = c2;

                    if (contrast >= minContrast) {

                        if (random === goodContrastColorsCount) {

                            break;
                        }

                        goodContrastColorsCount++;
                    }
                }
            }
        }

        return {
            contrast: contrast,
            index: colorIndex
        };
    },

    //najde kontrast barvy k bílé a černé
    addBlackWhiteContrast = function (i) {

        this.currentPalette.colors[i].contrastWithBlack       = calcContrastRatio(BLACK, this.currentPalette.colors[i].color);
        this.currentPalette.colors[i].contrastWithBlackColor  = BLACK;
        this.currentPalette.colors[i].contrastWithBlackIndex  = BLACK_INDEX;
        this.currentPalette.colors[i].contrastWithBlackOk     = this.currentPalette.colors[i].contrastWithBlack >= TEXT_COLOR_MIN_CONTRAST;

        if (this.currentPalette.colors[i].contrastWithBlack > TEXT_COLOR_MIN_CONTRAST) {

            this.currentPalette.colors[i].contrastWithBlack2      = calcContrastRatio(BLACK2, this.currentPalette.colors[i].color);
            this.currentPalette.colors[i].contrastWithBlack2Color = BLACK2;
            this.currentPalette.colors[i].contrastWithBlack2Index = BLACK2_INDEX;
            this.currentPalette.colors[i].contrastWithBlack2Ok    = this.currentPalette.colors[i].contrastWithBlack2 >= TEXT_COLOR_MIN_CONTRAST;

            if (this.currentPalette.colors[i].contrastWithBlack2 > TEXT_COLOR_MIN_CONTRAST) {

                this.currentPalette.colors[i].contrastWithBlack3      = calcContrastRatio(BLACK3, this.currentPalette.colors[i].color);
                this.currentPalette.colors[i].contrastWithBlack3Color = BLACK3;
                this.currentPalette.colors[i].contrastWithBlack3Index = BLACK3_INDEX;
                this.currentPalette.colors[i].contrastWithBlack3Ok    = this.currentPalette.colors[i].contrastWithBlack3 >= TEXT_COLOR_MIN_CONTRAST;
            }
        }

        this.currentPalette.colors[i].contrastWithWhite       = calcContrastRatio(WHITE, this.currentPalette.colors[i].color);
        this.currentPalette.colors[i].contrastWithWhiteColor  = WHITE;
        this.currentPalette.colors[i].contrastWithWhiteIndex  = WHITE_INDEX;
        this.currentPalette.colors[i].contrastWithWhiteOk     = this.currentPalette.colors[i].contrastWithWhite >= TEXT_COLOR_MIN_CONTRAST;

        if (this.currentPalette.colors[i].contrastWithWhite > TEXT_COLOR_MIN_CONTRAST) {

            this.currentPalette.colors[i].contrastWithWhite2      = calcContrastRatio(WHITE2, this.currentPalette.colors[i].color);
            this.currentPalette.colors[i].contrastWithWhite2Color = WHITE2;
            this.currentPalette.colors[i].contrastWithWhite2Index = WHITE2_INDEX;
            this.currentPalette.colors[i].contrastWithWhite2Ok    = this.currentPalette.colors[i].contrastWithWhite2 >= TEXT_COLOR_MIN_CONTRAST;

            if (this.currentPalette.colors[i].contrastWithWhite2 > TEXT_COLOR_MIN_CONTRAST) {

                this.currentPalette.colors[i].contrastWithWhite3      = calcContrastRatio(WHITE3, this.currentPalette.colors[i].color);
                this.currentPalette.colors[i].contrastWithWhite3Color = WHITE3;
                this.currentPalette.colors[i].contrastWithWhite3Index = WHITE3_INDEX;
                this.currentPalette.colors[i].contrastWithWhite3Ok    = this.currentPalette.colors[i].contrastWithWhite3 >= TEXT_COLOR_MIN_CONTRAST;
            }
        }
    },

    addTextColor = function (i, colors) {

        //pokud je barva bílá (= pozadí je bílé) a nemá se automaticky použít černá
        //nebo pokud je barva černá a nemá se automaticky použít bílá
        //vyhledá se barva s nejvyšším kontrastem
        var rgb = [
                this.currentPalette.colors[i].color.red(),
                this.currentPalette.colors[i].color.green(),
                this.currentPalette.colors[i].color.blue()
            ],

            isBlack = rgb[0] <= MIN_BLACK && rgb[1] <= MIN_BLACK && rgb[2] <= MIN_BLACK && Math.abs(rgb[0] - rgb[1]) <= MAX_DIFF && Math.abs(rgb[0] - rgb[2]) <= MAX_DIFF,
            isWhite = rgb[0] >= MIN_WHITE && rgb[1] >= MIN_WHITE && rgb[2] >= MIN_WHITE && Math.abs(rgb[0] - rgb[1]) <= MAX_DIFF && Math.abs(rgb[0] - rgb[2]) <= MAX_DIFF;

        if ((isWhite && !this.useBlackTextForWhite) || (isBlack && this.useColorTextForBlack)) {

            var highestContrastColor = findColorWithGoodContrast.call(this, i, colors, COLOR_TEXT_COLOR_MIN_CONTRAST, this.randomTextColorFactor);

            //pokud nejvyšší kontrast není dostatečný, použije se černá/bílá
            if (highestContrastColor.contrast >= COLOR_TEXT_COLOR_MIN_CONTRAST) {

                this.currentPalette.colors[i].textColor    = this.currentPalette.colors[highestContrastColor.index].self;
                this.currentPalette.colors[i].textColorRef = highestContrastColor.index;

                return;
            }
        }

        //pokud je černá kontrastnější než bílá, použije se "nejsvětlejší černá"
        var black = (this.currentPalette.colors[i].contrastWithBlack3Ok && 3) || (this.currentPalette.colors[i].contrastWithBlack2Ok && 2) || "",
            white = (this.currentPalette.colors[i].contrastWithWhite3Ok && 3) || (this.currentPalette.colors[i].contrastWithWhite2Ok && 2) || "",

            blackContrast = this.currentPalette.colors[i]["contrastWithBlack" + black],
            whiteContrast = this.currentPalette.colors[i]["contrastWithWhite" + white],
            blackColor    = this.currentPalette.colors[i]["contrastWithBlack" + black + "Color"],
            whiteColor    = this.currentPalette.colors[i]["contrastWithWhite" + white + "Color"],
            blackIndex    = this.currentPalette.colors[i]["contrastWithBlack" + black + "Index"],
            whiteIndex    = this.currentPalette.colors[i]["contrastWithWhite" + white + "Index"];

            this.currentPalette.colors[i].textColor    = blackContrast > whiteContrast ? blackColor : whiteColor;
            this.currentPalette.colors[i].textColorRef = blackContrast > whiteContrast ? blackIndex : whiteIndex;
    },

    //vzájemný kontrast barev (ignoruje se přidaná bílá, jinak by měla vždy nejvyšší kontrast)
    addColorContrast = function (i, colors) {

        var c2 = colors.length - 1;

        for (c2; c2 >= 0; c2--) {

            if ((i !== c2 && c2 !== colors.length - 1) || !this.whiteAdded) {

                this.currentPalette.colors[i]["contrastWith" + c2] = calcContrastRatio(
                    this.currentPalette.colors[c2].color, this.currentPalette.colors[i].color
                );
            }
        }
    },

    addSpecialColor = function (i, colors) {

        //najít barvu s nejvyšším kontrastem; jinou než použitou pro text
        var highestContrastColor = findColorWithGoodContrast.call(this, i, colors, SPECIAL_COLOR_MIN_CONTRAST, this.randomSpecialColorFactor, function (i, i2) {
            return this.currentPalette.colors[i2].self !== this.currentPalette.colors[i].textColor;
        });

        if (highestContrastColor.contrast < SPECIAL_COLOR_MIN_CONTRAST) {

            this.currentPalette.colors[i].specialColor    = this.currentPalette.colors[i].textColor;
            this.currentPalette.colors[i].specialColorRef = this.currentPalette.colors[i].textColorRef;

        } else {

            this.currentPalette.colors[i].specialColor    = this.currentPalette.colors[highestContrastColor.index].self;
            this.currentPalette.colors[i].specialColorRef = highestContrastColor.index;
        }
    },

    processPalette = function (palette, doNotRewrite, singleColorChanged) {

        var colors = palette.colors.slice(),
            c = colors.length - 1;

        this.whiteAdded = true;

        //přidání bílé barvy, aby mohly vznikat i sekce s bílým pozadím
        for (c; c >= 0; c--) {

            if (this.equals(colors[c], "rgb(255, 255, 255)")) {

                this.whiteAdded = false;

                break;
            }
        }

        if (this.whiteAdded) {

            colors.push("rgb(255, 255, 255)");
        }

        this.currentPalette.colors = {};

        c = colors.length - 1;

        for (c; c >= 0; c--) {

            this.currentPalette.colors[c] = {};

            this.currentPalette.colors[c].color = new Spectra(colors[c]);
            //textová reprezentace barvy
            this.currentPalette.colors[c].self  = getRgbString(this.currentPalette.colors[c].color);

            addBlackWhiteContrast.call(this, c);
        }

        c = colors.length - 1;

        for (c; c >= 0; c--) {

            addColorContrast.call(this, c, colors);
        }

        c = colors.length - 1;

        for (c; c >= 0; c--) {

            addTextColor.call(this, c, colors);
        }

        c = colors.length - 1;

        for (c; c >= 0; c--) {

            addSpecialColor.call(this, c, colors);
        }

        if (!doNotRewrite) {

            var prevSection = null;

            this.page.forEachPageSectionByIndex(function (section) {

                section.handleDefaultColorsChanged(this, !!singleColorChanged, prevSection);

                prevSection = section;

            }.bind(this));
        }
    },

    DefaultColorsGenerator = function DefaultColorsGenerator(pageComponent, initPalette) {

        this.page = pageComponent;

        this.initPalette = initPalette;

        this.init();
    };

DefaultColorsGenerator.prototype.reset = function () {

    this.destroy();

    this.init();
};

DefaultColorsGenerator.prototype.destroy = function () {

    this.colorsSettingsObserver.cancel();
};

DefaultColorsGenerator.prototype.init = function () {

    this.currentPalette = {};

    this.useBlackTextForWhite     = this.page.get("page.settings.colorPalette.useBlackTextForWhite");
    this.useColorTextForBlack     = this.page.get("page.settings.colorPalette.useColorTextForBlack");
    this.randomTextColorFactor    = this.page.get("page.settings.colorPalette.randomTextColorFactor");
    this.randomSpecialColorFactor = this.page.get("page.settings.colorPalette.randomSpecialColorFactor");

    processPalette.call(this, this.initPalette, true);

    this.colorsSettingsObserver = this.page.observe("page.settings.colorPalette", function (newValue, oldValue) {

        if (!oldValue || this.skipObserver) {

            return;
        }

        var singleColorChanged = newValue === oldValue;

        if (!singleColorChanged) {

            this.useBlackTextForWhite     = !!Math.round(Math.random());
            this.useColorTextForBlack     = !!Math.round(Math.random());
            this.randomTextColorFactor    = Math.round(Math.random() * 3);
            this.randomSpecialColorFactor = Math.round(Math.random() * 3);

            this.skipObserver = true;

            this.page.set("page.settings.colorPalette.useBlackTextForWhite",    this.useBlackTextForWhite);
            this.page.set("page.settings.colorPalette.useColorTextForBlack",    this.useColorTextForBlack);
            this.page.set("page.settings.colorPalette.randomTextColorFactor",   this.randomTextColorFactor);
            this.page.set("page.settings.colorPalette.randomSpecialColorFactor",this.randomSpecialColorFactor);

            this.skipObserver = false;
        }

        processPalette.call(this, newValue, false, singleColorChanged);

    }.bind(this), {init: false});
};

//vrátí náhodou (nebo podle indexu) skupinu paletu
DefaultColorsGenerator.prototype.getColors = function (index) {

    if (!this.currentPalette.colors) {

        processPalette.call(this, this.initPalette, true);
    }

    index = typeof index !== "undefined" ? index : Math.round(Math.random() * (Object.keys(this.currentPalette.colors).length - 1));

    var colors = this.currentPalette.colors[index];

    return {
        backgroundColor   : colors.self,
        textColor         : colors.textColor,
        specialColor      : colors.specialColor,
        backgroundColorRef: index
    };
};

//vrátí barvu podle indexu
DefaultColorsGenerator.prototype.getColor = function (index) {

    if (!this.currentPalette.colors) {

        processPalette.call(this, this.initPalette, true);
    }

    switch (index) {
        case WHITE_INDEX : return getRgbString(WHITE);
        case WHITE2_INDEX: return getRgbString(WHITE2);
        case WHITE3_INDEX: return getRgbString(WHITE3);
        case BLACK_INDEX : return getRgbString(BLACK);
        case BLACK2_INDEX: return getRgbString(BLACK2);
        case BLACK3_INDEX: return getRgbString(BLACK3);
        default: return this.currentPalette.colors[index] ? this.currentPalette.colors[index].self : this.currentPalette.colors[this.indexOf("rgb(255,255,255)")].self;
    }
};

//vrátí barvu textu k dané barvě (index)
DefaultColorsGenerator.prototype.getTextColor = function (index) {

    if (!this.currentPalette.colors) {

        processPalette.call(this, this.initPalette, true);
    }

    return this.currentPalette.colors[index] ? this.currentPalette.colors[index].textColor : this.currentPalette.colors[this.indexOf("rgb(255,255,255)")].textColor;
};

//vrátí speciální barvu k dané barvě (index)
DefaultColorsGenerator.prototype.getSpecialColor = function (index) {

    if (!this.currentPalette.colors) {

        processPalette.call(this, this.initPalette, true);
    }

    return this.currentPalette.colors[index] ? this.currentPalette.colors[index].specialColor : this.currentPalette.colors[this.indexOf("rgb(255,255,255)")].specialColor;
};

//najde index barvy (color)
DefaultColorsGenerator.prototype.indexOf = function (color) {

    if (!this.currentPalette.colors || typeof color !== "string") {

        return -1;
    }

    var c = Object.keys(this.currentPalette.colors).length - 1;

    color = color.replace(/\s/g, "");

    for (c; c >= 0; c--) {

        if (this.currentPalette.colors[c].self.replace(/\s/g, "") === color) {

            return c;
        }
    }

    return -1;
};

//najde index barvy (color)
DefaultColorsGenerator.prototype.equals = function (color1, color2) {

    return color1.replace(/\s/g, "") === color2.replace(/\s/g, "");
};

module.exports = DefaultColorsGenerator;
