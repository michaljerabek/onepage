/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

var Spectra = require("spectra");

var BLACK  = new Spectra("#000000"),
    BLACK2 = new Spectra("#222222"),
    BLACK3 = new Spectra("#404040"),
    WHITE  = new Spectra("#ffffff"),
    WHITE2 = new Spectra("#f0f0f0"),
    WHITE3 = new Spectra("#e7e7e7"),

    BLACK_RGB  = BLACK.rgbaString().replace(/\s*,[0-9]+\)/i, ")").replace(/rgba/i, "rgb"),
    BLACK2_RGB = BLACK2.rgbaString().replace(/\s*,[0-9]+\)/i, ")").replace(/rgba/i, "rgb"),
    BLACK3_RGB = BLACK3.rgbaString().replace(/\s*,[0-9]+\)/i, ")").replace(/rgba/i, "rgb"),
    WHITE_RGB  = WHITE.rgbaString().replace(/\s*,[0-9]+\)/i, ")").replace(/rgba/i, "rgb"),
    WHITE2_RGB = WHITE2.rgbaString().replace(/\s*,[0-9]+\)/i, ")").replace(/rgba/i, "rgb"),
    WHITE3_RGB = WHITE3.rgbaString().replace(/\s*,[0-9]+\)/i, ")").replace(/rgba/i, "rgb"),

    WHITE_INDEX  = -2,
    WHITE2_INDEX = -3,
    WHITE3_INDEX = -4,
    BLACK_INDEX  = -5,
    BLACK2_INDEX = -6,
    BLACK3_INDEX = -7,

    MIN_BLACK = 68,
    MIN_WHITE = 224,
    MAX_DIFF  = 9,

    TEXT_COLOR_MIN_CONTRAST                = 12,
    TEXT_COLOR_MAX_CONTRAST                = 17,
    COLOR_TEXT_COLOR_MIN_CONTRAST          =  6,
    ON_BLACK_COLOR_TEXT_COLOR_MAX_CONTRAST = 14,
    SPECIAL_COLOR_MIN_CONTRAST             =  5,
    SPECIAL_COLOR_MAX_CONTRAST             = 17,
    ON_BLACK_SPECIAL_COLOR_MAX_CONTRAST    = 14,

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
    findColorWithGoodContrast = function (i, minContrast, maxContrast, random, fn) {

        maxContrast = maxContrast || 21;

        random = random || 0;

        var colors = this.currentPalette.colors[i].sorted,
            c2 = colors.length - 1,

            contrast = 0,
            colorIndex = -1,

            goodContrastColorsCount = 0;

        for (c2; c2 >= 0; c2--) {

            if (!fn || fn.call(this, i, colors[c2])) {

                var thisContrast = this.currentPalette.colors[i]["contrastWith" + colors[c2]];

                if (thisContrast >= minContrast && thisContrast <= maxContrast) {

                    this.currentPalette.colors[i].hue        = typeof this.currentPalette.colors[i].hue          !== "undefined" ? this.currentPalette.colors[i].hue : this.currentPalette.colors[i].color.hue();
                    this.currentPalette.colors[i].saturation = typeof this.currentPalette.colors[i].saturation          !== "undefined" ? this.currentPalette.colors[i].saturation : this.currentPalette.colors[i].color.saturation();

                    this.currentPalette.colors[colors[c2]].hue        = typeof this.currentPalette.colors[colors[c2]].hue !== "undefined" ? this.currentPalette.colors[colors[c2]].hue : this.currentPalette.colors[colors[c2]].color.hue();
                    this.currentPalette.colors[colors[c2]].saturation = typeof this.currentPalette.colors[colors[c2]].saturation !== "undefined" ? this.currentPalette.colors[colors[c2]].saturation : this.currentPalette.colors[colors[c2]].color.saturation();

                    var iHue = this.currentPalette.colors[i].hue,
                        cHue = this.currentPalette.colors[colors[c2]].hue,
                        iSat = this.currentPalette.colors[i].saturation,
                        cSat = this.currentPalette.colors[colors[c2]].saturation;

                    //odstranit červenou na zelené
                    if (iSat > 0.05 && cSat > 0.05 && ((iHue > 75 && iHue < 145) || (cHue > 75 && cHue < 145)) && ((iHue > 325 || iHue < 25) || (cHue > 325 || cHue < 25))) {

                        if (!(this.currentPalette.colors[i].isDark || this.currentPalette.colors[colors[c2]].isDark)) {

                            continue;
                        }
                    }

                    contrast = thisContrast;
                    colorIndex = colors[c2];

                    if (Math.abs(random + i) % 4 === goodContrastColorsCount) {

                        break;
                    }

                    goodContrastColorsCount++;
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
        this.currentPalette.colors[i].contrastWithBlackColor  = BLACK_RGB;
        this.currentPalette.colors[i].contrastWithBlackIndex  = BLACK_INDEX;
        this.currentPalette.colors[i].contrastWithBlackOk     = this.currentPalette.colors[i].contrastWithBlack >= TEXT_COLOR_MIN_CONTRAST;

        if (this.currentPalette.colors[i].contrastWithBlack > TEXT_COLOR_MIN_CONTRAST) {

            this.currentPalette.colors[i].contrastWithBlack2      = calcContrastRatio(BLACK2, this.currentPalette.colors[i].color);
            this.currentPalette.colors[i].contrastWithBlack2Color = BLACK2_RGB;
            this.currentPalette.colors[i].contrastWithBlack2Index = BLACK2_INDEX;
            this.currentPalette.colors[i].contrastWithBlack2Ok    = this.currentPalette.colors[i].contrastWithBlack2 >= TEXT_COLOR_MIN_CONTRAST;

            if (this.currentPalette.colors[i].contrastWithBlack2 > TEXT_COLOR_MIN_CONTRAST) {

                this.currentPalette.colors[i].contrastWithBlack3      = calcContrastRatio(BLACK3, this.currentPalette.colors[i].color);
                this.currentPalette.colors[i].contrastWithBlack3Color = BLACK3_RGB;
                this.currentPalette.colors[i].contrastWithBlack3Index = BLACK3_INDEX;
                this.currentPalette.colors[i].contrastWithBlack3Ok    = this.currentPalette.colors[i].contrastWithBlack3 >= TEXT_COLOR_MIN_CONTRAST;
            }
        }

        this.currentPalette.colors[i].contrastWithWhite       = calcContrastRatio(WHITE, this.currentPalette.colors[i].color);
        this.currentPalette.colors[i].contrastWithWhiteColor  = WHITE_RGB;
        this.currentPalette.colors[i].contrastWithWhiteIndex  = WHITE_INDEX;
        this.currentPalette.colors[i].contrastWithWhiteOk     = this.currentPalette.colors[i].contrastWithWhite >= TEXT_COLOR_MIN_CONTRAST;

        if (this.currentPalette.colors[i].contrastWithWhite > TEXT_COLOR_MIN_CONTRAST) {

            this.currentPalette.colors[i].contrastWithWhite2      = calcContrastRatio(WHITE2, this.currentPalette.colors[i].color);
            this.currentPalette.colors[i].contrastWithWhite2Color = WHITE2_RGB;
            this.currentPalette.colors[i].contrastWithWhite2Index = WHITE2_INDEX;
            this.currentPalette.colors[i].contrastWithWhite2Ok    = this.currentPalette.colors[i].contrastWithWhite2 >= TEXT_COLOR_MIN_CONTRAST;

            if (this.currentPalette.colors[i].contrastWithWhite2 > TEXT_COLOR_MIN_CONTRAST) {

                this.currentPalette.colors[i].contrastWithWhite3      = calcContrastRatio(WHITE3, this.currentPalette.colors[i].color);
                this.currentPalette.colors[i].contrastWithWhite3Color = WHITE3_RGB;
                this.currentPalette.colors[i].contrastWithWhite3Index = WHITE3_INDEX;
                this.currentPalette.colors[i].contrastWithWhite3Ok    = this.currentPalette.colors[i].contrastWithWhite3 >= TEXT_COLOR_MIN_CONTRAST;
            }
        }
    },

    addTextColor = function (i) {

        //pokud je barva bílá (= pozadí je bílé) a nemá se automaticky použít černá
        //nebo pokud je barva černá a nemá se automaticky použít bílá
        //vyhledá se barva s nejvyšším kontrastem
        if ((this.currentPalette.colors[i].isWhite && (i + 1) % this.useBlackTextForWhite > 1) || (this.currentPalette.colors[i].isBlack && (i + 1) % this.useColorTextForBlack > 1)) {

            var highestContrastColor = findColorWithGoodContrast.call(this, i, COLOR_TEXT_COLOR_MIN_CONTRAST, this.currentPalette.colors[i].isBlack || this.currentPalette.colors[i].isDark ? ON_BLACK_COLOR_TEXT_COLOR_MAX_CONTRAST : TEXT_COLOR_MAX_CONTRAST, this.randomTextColorFactor);

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

    addSpecialColor = function (i) {

        //najít barvu s nejvyšším kontrastem; jinou než použitou pro text
        var highestContrastColor = findColorWithGoodContrast.call(this, i, SPECIAL_COLOR_MIN_CONTRAST, this.currentPalette.colors[i].isBlack || this.currentPalette.colors[i].isDark ? ON_BLACK_SPECIAL_COLOR_MAX_CONTRAST : SPECIAL_COLOR_MAX_CONTRAST, this.randomSpecialColorFactor, function (i, i2) {
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

    sortColorContrastByContrast = function (i) {
        
        var keys = Object.keys(this.currentPalette.colors[i]);

        keys.sort(function (a, b) {

            if (!a.match(/contrastWith[0-9]+/)) {

                return 1;
            }

            if (!b.match(/contrastWith[0-9]+/)) {

                return -1;
            }

            return this.currentPalette.colors[i][b] - this.currentPalette.colors[i][a];

        }.bind(this));

        this.currentPalette.colors[i].sorted = [];

        var k = 0;

        for (k; k < keys.length; k++) {

            var prop = keys[k].match(/contrastWith([0-9])+/);

            if (prop) {

                this.currentPalette.colors[i].sorted.push(+prop[1]);

            } else {

                break;
            }
        }
    },
    
    addWhiteToPalette = function (colors) {

        var c = colors.length - 1;

        this.whiteAdded = true;

        for (c; c >= 0; c--) {

            if (this.equals(colors[c], WHITE_RGB)) {

                this.whiteAdded = false;

                break;
            }
        }

        if (this.whiteAdded) {

            colors.push(WHITE_RGB);
        }
    },

    findInOldColors = function (color) {

        var oC = this.oldCount - 1;

        for (oC; oC >= 0; oC--) {

            if (color === this.oldColors[oC].self) {

                return oC;
            }
        }

        return false;
    },

    copyOldColorData = function (o, c) {

        this.currentPalette.colors[c].color   = this.oldColors[o].color;
        this.currentPalette.colors[c].self    = this.oldColors[o].self;
        this.currentPalette.colors[c].isBlack = this.oldColors[o].isBlack;
        this.currentPalette.colors[c].isWhite = this.oldColors[o].isWhite;
        this.currentPalette.colors[c].isDark  = this.oldColors[o].isDark;

        this.currentPalette.colors[c].contrastWithBlack       = this.oldColors[o].contrastWithBlack;
        this.currentPalette.colors[c].contrastWithBlackColor  = this.oldColors[o].contrastWithBlackColor;
        this.currentPalette.colors[c].contrastWithBlackIndex  = this.oldColors[o].contrastWithBlackIndex;
        this.currentPalette.colors[c].contrastWithBlackOk     = this.oldColors[o].contrastWithBlackOk;

        this.currentPalette.colors[c].contrastWithBlack2      = this.oldColors[o].contrastWithBlack2;
        this.currentPalette.colors[c].contrastWithBlack2Color = this.oldColors[o].contrastWithBlack2Color;
        this.currentPalette.colors[c].contrastWithBlack2Index = this.oldColors[o].contrastWithBlack2Index;
        this.currentPalette.colors[c].contrastWithBlack2Ok    = this.oldColors[o].contrastWithBlack2Ok;

        this.currentPalette.colors[c].contrastWithBlack3      = this.oldColors[o].contrastWithBlack3;
        this.currentPalette.colors[c].contrastWithBlack3Color = this.oldColors[o].contrastWithBlack3Color;
        this.currentPalette.colors[c].contrastWithBlack3Index = this.oldColors[o].contrastWithBlack3Index;
        this.currentPalette.colors[c].contrastWithBlack3Ok    = this.oldColors[o].contrastWithBlack3Ok;

        this.currentPalette.colors[c].contrastWithWhite       = this.oldColors[o].contrastWithWhite;
        this.currentPalette.colors[c].contrastWithWhiteColor  = this.oldColors[o].contrastWithWhiteColor;
        this.currentPalette.colors[c].contrastWithWhiteIndex  = this.oldColors[o].contrastWithWhiteIndex;
        this.currentPalette.colors[c].contrastWithWhiteOk     = this.oldColors[o].contrastWithWhiteOk;

        this.currentPalette.colors[c].contrastWithWhite2      = this.oldColors[o].contrastWithWhite2;
        this.currentPalette.colors[c].contrastWithWhite2Color = this.oldColors[o].contrastWithWhite2Color;
        this.currentPalette.colors[c].contrastWithWhite2Index = this.oldColors[o].contrastWithWhite2Index;
        this.currentPalette.colors[c].contrastWithWhite2Ok    = this.oldColors[o].contrastWithWhite2Ok;

        this.currentPalette.colors[c].contrastWithWhite3      = this.oldColors[o].contrastWithWhite3;
        this.currentPalette.colors[c].contrastWithWhite3Color = this.oldColors[o].contrastWithWhite3Color;
        this.currentPalette.colors[c].contrastWithWhite3Index = this.oldColors[o].contrastWithWhite3Index;
        this.currentPalette.colors[c].contrastWithWhite3Ok    = this.oldColors[o].contrastWithWhite3Ok;

        this.currentPalette.colors[c].hue        = this.oldColors[o].hue;
        this.currentPalette.colors[c].saturation = this.oldColors[o].saturation;
    },

    createNewColorBase = function (i, color) {

        this.currentPalette.colors[i].color   = new Spectra(color);
        //textová reprezentace barvy
        this.currentPalette.colors[i].self    = getRgbString(this.currentPalette.colors[i].color);
        
        var rgb = [this.currentPalette.colors[i].color.red(), this.currentPalette.colors[i].color.green(), this.currentPalette.colors[i].color.blue()];

        this.currentPalette.colors[i].isBlack = typeof this.currentPalette.colors[i].isBlack !== "undefined" ? this.currentPalette.colors[i].isBlack : (rgb[0] <= MIN_BLACK && rgb[1] <= MIN_BLACK && rgb[2] <= MIN_BLACK && Math.abs(rgb[0] - rgb[1]) <= MAX_DIFF && Math.abs(rgb[0] - rgb[2]) <= MAX_DIFF) || this.currentPalette.colors[i].color.near(BLACK, 10) || this.currentPalette.colors[i].color.near(BLACK2, 10);
        this.currentPalette.colors[i].isWhite = typeof this.currentPalette.colors[i].isWhite !== "undefined" ? this.currentPalette.colors[i].isWhite : (rgb[0] >= MIN_WHITE && rgb[1] >= MIN_WHITE && rgb[2] >= MIN_WHITE && Math.abs(rgb[0] - rgb[1]) <= MAX_DIFF && Math.abs(rgb[0] - rgb[2]) <= MAX_DIFF) || this.currentPalette.colors[i].color.near(WHITE, 10) || this.currentPalette.colors[i].color.near(WHITE2, 10) || this.currentPalette.colors[i].color.near(WHITE3, 10);
        this.currentPalette.colors[i].isDark  = typeof this.currentPalette.colors[i].isDark  !== "undefined" ? this.currentPalette.colors[i].isDark  : this.currentPalette.colors[i].color.near(BLACK, 25);
    },

    processPalette = function (palette, doNotRewrite, singleColorChanged) {

        var colors = palette.colors.slice();

        //přidání bílé barvy, aby mohly vznikat i sekce s bílým pozadím
        addWhiteToPalette.call(this, colors);

        this.oldColors = this.currentPalette.colors || [];
        this.oldCount = Object.keys(this.oldColors).length;

        var c = colors.length - 1;

        this.currentPalette.colors = {};

        for (c; c >= 0; c--) {

            this.currentPalette.colors[c] = {};

            var inOld = findInOldColors.call(this, colors[c]);

            if (inOld === false) {

                createNewColorBase.call(this, c, colors[c]);

                addBlackWhiteContrast.call(this, c);

            } else {

                copyOldColorData.call(this, inOld, c);
            }
        }

        c = colors.length - 1;

        for (c; c >= 0; c--) {

            addColorContrast.call(this, c, colors);

            sortColorContrastByContrast.call(this, c);
        }
        
        c = colors.length - 1;

        for (c; c >= 0; c--) {

            addTextColor.call(this, c);
        }

        c = colors.length - 1;

        for (c; c >= 0; c--) {

            addSpecialColor.call(this, c);
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

    this.currentPalette = null;

    this.colorsSettingsObserver.cancel();
};

DefaultColorsGenerator.prototype.init = function () {

    this.currentPalette = {};

    this.useBlackTextForWhite     = this.page.get("page.settings.colorPalette.useBlackTextForWhite");
    this.useColorTextForBlack     = this.page.get("page.settings.colorPalette.useColorTextForBlack");
    this.randomTextColorFactor    = this.page.get("page.settings.colorPalette.randomTextColorFactor");
    this.randomSpecialColorFactor = this.page.get("page.settings.colorPalette.randomSpecialColorFactor");

    this.useBlackTextForWhite     = typeof this.useBlackTextForWhite     === "number" ? this.useBlackTextForWhite     : 1;
    this.useColorTextForBlack     = typeof this.useColorTextForBlack     === "number" ? this.useColorTextForBlack     : 1;
    this.randomTextColorFactor    = typeof this.randomTextColorFactor    === "number" ? this.randomTextColorFactor    : 0;
    this.randomSpecialColorFactor = typeof this.randomSpecialColorFactor === "number" ? this.randomSpecialColorFactor : 3;

    processPalette.call(this, this.initPalette, true);

    this.colorsSettingsObserver = this.page.observe("page.settings.colorPalette", function (newValue, oldValue) {

        if (!oldValue || this.skipObserver) {

            return;
        }

        var singleColorChanged = newValue === oldValue;

        if (!singleColorChanged) {

            this.useBlackTextForWhite     = Math.round(Math.random() * 3) + 2; //plus 2, protože index se zvyžuje o 1, aby nebyl vždy 0
            this.useColorTextForBlack     = Math.round(Math.random() * 3) + 2; //plus 2, protože index se zvyžuje o 1, aby nebyl vždy 0
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
        case WHITE_INDEX : return WHITE_RGB;
        case WHITE2_INDEX: return WHITE2_RGB;
        case WHITE3_INDEX: return WHITE3_RGB;
        case BLACK_INDEX : return BLACK_RGB;
        case BLACK2_INDEX: return BLACK2_RGB;
        case BLACK3_INDEX: return BLACK3_RGB;
        default: return this.currentPalette.colors[index] ? this.currentPalette.colors[index].self : this.currentPalette.colors[this.indexOf(WHITE_RGB)].self;
    }
};

//vrátí barvu textu k dané barvě (index)
DefaultColorsGenerator.prototype.getTextColor = function (index) {

    if (!this.currentPalette.colors) {

        processPalette.call(this, this.initPalette, true);
    }

    return this.currentPalette.colors[index] ? this.currentPalette.colors[index].textColor : this.currentPalette.colors[this.indexOf(WHITE_RGB)].textColor;
};

//vrátí speciální barvu k dané barvě (index)
DefaultColorsGenerator.prototype.getSpecialColor = function (index) {

    if (!this.currentPalette.colors) {

        processPalette.call(this, this.initPalette, true);
    }

    return this.currentPalette.colors[index] ? this.currentPalette.colors[index].specialColor : this.currentPalette.colors[this.indexOf(WHITE_RGB)].specialColor;
};

//najde index barvy (color)
DefaultColorsGenerator.prototype.indexOf = function (color) {

    if (!this.currentPalette.colors || typeof color !== "string") {

        return -1;
    }

    var c = Object.keys(this.currentPalette.colors).length - 1;

    for (c; c >= 0; c--) {

        if (this.equals(this.currentPalette.colors[c].self, color)) {

            return c;
        }
    }

    return -1;
};

//zjistí, jestli jsou barvy shodné | barvy musí být ve formátu: rgb(0, 0, 0)
DefaultColorsGenerator.prototype.equals = function (color1, color2) {

    return color1.replace(/\s/g, "") === color2.replace(/\s/g, "");
};

DefaultColorsGenerator.prototype.getBlackWhite = function (color, minContrast, preferWhite) {

    minContrast = minContrast || TEXT_COLOR_MIN_CONTRAST;

    color = {
        color: Spectra(color)
    };

    color.contrastWithBlack = calcContrastRatio(BLACK, color.color);
    color.contrastWithWhite = calcContrastRatio(WHITE, color.color);

    if (preferWhite && color.contrastWithWhite >= minContrast) {

        if (color.contrastWithWhiteOk) {

            return WHITE_RGB;
        }
    }

    return color.contrastWithBlack > color.contrastWithWhite ? BLACK_RGB : WHITE_RGB;
};
//
//DefaultColorsGenerator.prototype.getBlackWhite = function (color, minContrast, preferWhite) {
//
//    minContrast = minContrast || TEXT_COLOR_MIN_CONTRAST;
//
//    color = {
//        color: Spectra(color)
//    };
//
//    color.contrastWithBlack       = calcContrastRatio(BLACK, color.color);
//    color.contrastWithBlackColor  = BLACK_RGB;
//    color.contrastWithBlackOk     = color.contrastWithBlack >= minContrast;
//
//    if (color.contrastWithBlack > minContrast) {
//
//        color.contrastWithBlack2      = calcContrastRatio(BLACK2, color.color);
//        color.contrastWithBlack2Color = BLACK2_RGB;
//        color.contrastWithBlack2Ok    = color.contrastWithBlack2 >= minContrast;
//
//        if (color.contrastWithBlack2 > minContrast) {
//
//            color.contrastWithBlack3      = calcContrastRatio(BLACK3, color.color);
//            color.contrastWithBlack3Color = BLACK3_RGB;
//            color.contrastWithBlack3Ok    = color.contrastWithBlack3 >= minContrast;
//        }
//    }
//
//    color.contrastWithWhite       = calcContrastRatio(WHITE, color.color);
//    color.contrastWithWhiteColor  = WHITE_RGB;
//    color.contrastWithWhiteOk     = color.contrastWithWhite >= minContrast;
//    color.contrastWithWhiteOk2    = color.contrastWithWhite >= TEXT_COLOR_MIN_CONTRAST;
//
//    if (color.contrastWithWhite > minContrast) {
//
//        color.contrastWithWhite2      = calcContrastRatio(WHITE2, color.color);
//        color.contrastWithWhite2Color = WHITE2_RGB;
//        color.contrastWithWhite2Ok    = color.contrastWithWhite2 >= minContrast;
//        color.contrastWithWhite2Ok2   = color.contrastWithWhite2 >= TEXT_COLOR_MIN_CONTRAST;
//
//        if (color.contrastWithWhite2 > minContrast) {
//
//            color.contrastWithWhite3      = calcContrastRatio(WHITE3, color.color);
//            color.contrastWithWhite3Color = WHITE3_RGB;
//            color.contrastWithWhite3Ok    = color.contrastWithWhite3 >= minContrast;
//            color.contrastWithWhite3Ok2   = color.contrastWithWhite3 >= TEXT_COLOR_MIN_CONTRAST;
//        }
//    }
//
//    if (preferWhite) {
//
//        if (color.contrastWithWhite3Ok2) {
//
//            return WHITE3_RGB;
//        }
//
//        if (color.contrastWithWhite2Ok2) {
//
//            return WHITE2_RGB;
//        }
//
//        if (color.contrastWithWhiteOk) {
//
//            return WHITE_RGB;
//        }
//    }
//
//    var black = (color.contrastWithBlack3Ok && 3) || (color.contrastWithBlack2Ok && 2) || "",
//        white = (color.contrastWithWhite3Ok && 3) || (color.contrastWithWhite2Ok && 2) || "",
//
//        blackContrast = color["contrastWithBlack" + black],
//        whiteContrast = color["contrastWithWhite" + white],
//        blackColor    = color["contrastWithBlack" + black + "Color"],
//        whiteColor    = color["contrastWithWhite" + white + "Color"];
//
//    return blackContrast > whiteContrast ? blackColor : whiteColor;
//};

module.exports = DefaultColorsGenerator;
