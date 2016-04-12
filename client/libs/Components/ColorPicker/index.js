/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var Ractive = require("ractive"),
            ColorPickerPalette = require("./Components/ColorPickerPalette"),
            Spectra = require("spectra"),
            U = require("./../../U"),
            template = require("./index.tpl"),
            on = require("./../../../../helpers/on");

        module.exports = factory(Ractive, ColorPickerPalette, Spectra, U, template, on);

    } else {

        root.ColorPicker = factory(root.Ractive, root.ColorPickerPalette, root.Spectra, root.U, "", {client: true});
    }

}(this, function (Ractive, ColorPickerPalette, Spectra, U, template, on) {

    var instanceCounter = 0;

    return Ractive.extend({

        COLOR_PICKER: true,

        template: template,

        components: {
            ColorPickerPalette: ColorPickerPalette
        },

        computed: {
            SVBoxHue: function () {

                return this.HBoxColor.hue(this.get("hue") || 0).rgbaString();
            },
            current: function () {

                return this.currentColor.rgbaString();
            }
        },

        data: function () {

            return {
                initial: "rgb(255, 255, 255)",

                SVSelector: {
                    x: 0,
                    y: 0
                },

                HSelector: {
                    y: 0
                },

                animate: false,

                inputType: "HEX",
                inputTextHEX: "",
                inputTextR: "",
                inputTextG: "",
                inputTextB: "",

                TYPE_HEX: "HEX",
                TYPE_RGB: "RGB",

                NO_COLOR: "noColor"
            };
        },

        onconstruct: function () {

            if (on.client) {

                Ractive.$win = Ractive.$win || $(window);
            }

            this.EVENT_NS = "ColorPicker-" + (++instanceCounter);
        },

        initializeColors: function () {

            var input = this.get("input");

            input = input || this.get("output");

            if (input) {

                this.set("initial", input);
            }

            var current = input || this.get("initial");

            this.currentColor = Spectra(current);
            //slouží pro získání barvy gradientu v SVBoxu
            this.HBoxColor = Spectra({ h: 0, s: 1, v: 1 });

            //počáteční hodnoty barvy
            this.skipUdateCurrent = true;
            this.set("hue", this.currentColor.hue());
            this.set("saturation", this.currentColor.saturationv());
            this.skipUdateCurrent = false;
            this.set("value", this.currentColor.value());
        },

        onconfig: function () {

            //nenastavovat barvu při otevření pickeru
            this.waitForUserInteraction = !!this.get("defer");

            this.initializeColors();

            this.observeColorComponents();

            this.observe("current", this.currentColorObserver, {init: false});

            this.observeSelectors();

            this.updateInputFields();

            this.observe("input", function (value) {

                //                                        this.waitForUserInteraction = this.get("defer");
                //
                //                    this.initializeColors();
                //
                //                    this.moveSelectorsToCurrentColorPosition(true);
                //
                //                    this.waitForUserInteraction = false;

            }, {init: false});

        },

        currentColorObserver: function () {

            if (this.skipUpdateCurrent)  {

                return;
            }

            //pokud se saturace změní na 0, pak si barva nezachová odstín
            if (!this.preserveCurrentColorHue) {

                this.skipHueObserver = this.skipUpdateColor;

                this.set("hue", this.currentColor.hue());

                this.skipHueObserver = false;
            }

            //pokud si barva nezachovala odstín (černá / bílá) je potřeba ho vrátit, jakmile barva není bílá nebo černá
            if (!this.skipUpdateColor && this.currentColor.hue() !== this.HBoxColor.hue() && (this.currentColor.saturationv() || this.currentColor.value())) {

                var saturation = this.get("saturation");

                //Pokud se nastaví černá, saturace se nastaví na 0, když se pak jede po hraně boxu (mění se "value"),
                //hodnota "saturation" se nezmění (nespustí se observer) a barva tak zůstane šedá.
                if (saturation && saturation !== this.currentColor.saturationv()) {

                    this.currentColor.saturationv(saturation);
                }

                this.currentColor.hue(this.HBoxColor.hue());
            }

            if (!this.waitForUserInteraction) {

                this.set("output", this.getCurrentRGB());
                this.fire("output", this.getCurrentRGB());
            }

            this.updateInputFields();
        },

        observeColorComponents: function () {

            this.observe("hue", function (hue) {

                if (this.skipHueObserver) {

                    return;
                }

                this.HBoxColor.hue(hue);

                this.currentColor.hue(hue);

                this.update("current");

            }, {init: false});

            this.observe("saturation", function (saturation) {

                this.currentColor.saturationv(saturation);

                this.preserveCurrentColorHue = true;

                this.update("current");

                this.preserveCurrentColorHue = false;

            }, {init: false});

            this.observe("value", function (value) {

                this.currentColor.value(value);

                this.preserveCurrentColorHue = true;

                this.update("current");

                this.preserveCurrentColorHue = false;

            }, {init: false});
        },

        observeSelectors: function () {

            this.observe("HSelector.y", function () {

                if (!this.skipUpdateColor) {

                    this.updateHue.apply(this, arguments);
                }
            }, {init: false});

            this.observe("SVSelector.x", function () {

                if (!this.skipUpdateColor) {

                    this.updateSaturation.apply(this, arguments);
                }
            }, {init: false});

            this.observe("SVSelector.y", function () {

                if (!this.skipUpdateColor) {

                    this.updateValue.apply(this, arguments);
                }
            }, {init: false});
        },

        onrender: function () {

            if (on.client) {

                this.initPalettes();

                this.SVBox = this.find(".ColorPicker--SV-box");
                this.SVSelector = this.find(".ColorPicker--SV-selector");

                this.HBox = this.find(".ColorPicker--H-box");
                this.HSelector = this.find(".ColorPicker--H-selector");

                this.moveSelectorsToCurrentColorPosition();

                if (!this.waitForUserInteraction) {

                    this.fire("output", this.getCurrentRGB());
                }

                Ractive.$win.on("resize", this.windowResizeHandler.bind(this));

                var pageElementSettings = this.findParent("PageElementSettings");

                if (pageElementSettings) {

                    pageElementSettings.observe("resizableElementWidth resizableElementHeight", this.windowResizeHandler.bind(this), {init: false});
                }

                this.waitForUserInteraction = false;
            }
        },

        initPalettes: function () {

            this.palettes = this.findAllComponents("ColorPickerPalette");

            var p = this.palettes.length - 1;

            for (p; p >= 0; p--) {

                this.palettes[p].on("setColor", function (event, color, animate) {

                    this.setColor(color, animate);

                    event.original.preventDefault();

                }.bind(this));
            }
        },

        onteardown: function () {

            Ractive.$win.off("." + this.EVENT_NS);
        },

        windowResizeHandler: function () {

            clearTimeout(this.windowResizeThrottle);

            this.windowResizeThrottle = setTimeout(function() {

                this.moveSelectorsToCurrentColorPosition();

            }.bind(this), 100);
        },

        getCurrentRGB: function () {

            return "rgb(" + this.currentColor.red() + ", " + this.currentColor.green() + ", " + this.currentColor.blue() + ")";
        },

        updateInputFields: function () {

            this.set("inputTextHEX", this.currentColor.hex());
            this.set("inputTextR",   this.currentColor.red());
            this.set("inputTextG",   this.currentColor.green());
            this.set("inputTextB",   this.currentColor.blue());
        },

        updateSaturation: function () {

            var width = this.SVBox.offsetWidth,

                x = this.get("SVSelector.x"),

                saturation = Math.min(1, Math.max(0, (x / width)));

            this.set("saturation", saturation);
        },

        updateValue: function () {

            var height = this.SVBox.offsetHeight,

                y = this.get("SVSelector.y"),

                value = 1 - Math.min(1, Math.max(0, (y / height)));

            this.set("value", value);
        },

        updateHue: function () {

            var height = this.HBox.offsetHeight,

                y = this.get("HSelector.y"),

                hue = 360 - Math.min(360, Math.max(0, (y / height) * 360));

            this.preserveCurrentColorHue = true;

            this.set("hue", hue);

            this.preserveCurrentColorHue = false;
        },

        moveSelectorsToCurrentColorPosition: function (animate) {

            this.moveHSelector(this.getHSelectorPosition(), animate);
            this.moveSVSelector(this.getSSelectorPosition(), this.getVSelectorPosition(), animate);
        },

        moveSVSelector: function (x, y, animate) {

            if (this.SVSelector) {

                var width = this.SVBox.offsetWidth,
                    height = this.SVBox.offsetHeight;

                x = Math.min(width, Math.max(0, x));
                y = Math.min(height, Math.max(0, y));

                this.set("animate", !!animate);

                this.set("SVSelector.y", y);
                this.set("SVSelector.x", x);
            }
        },

        moveHSelector: function (y, animate) {

            if (this.HSelector) {

                var height = this.HBox.offsetHeight;

                y = Math.min(height, Math.max(0, y));

                this.set("animate", !!animate);

                this.set("HSelector.y", y);
            }
        },

        setColor: function (color, animate) {

            if (color === this.get("NO_COLOR")) {

                this.set("output", "");
                this.fire("output", "");

                return;
            }

            this.currentColor = Spectra(color);

            //při zadávání barvy klávesnicí může dojít k malé změně barvy,
            //proto je potřeba zabránit její změně
            this.skipUpdateColor = true;

            this.moveSVSelector(this.getSSelectorPosition(), this.getVSelectorPosition(), animate);

            //nastavuje se černá nebo bílá barva, sytost by tak zmizela (nastavila se červená - 0)
            this.preserveCurrentColorHue = !this.currentColor.saturationv() || !this.currentColor.value();

            this.update("current");

            this.moveHSelector(this.getHSelectorPosition(), animate);

            this.preserveCurrentColorHue = false;

            this.skipUpdateColor = false;
        },

        getHSelectorPosition: function () {

            return this.HBox.offsetHeight - ((this.HBox.offsetHeight * (this.HBoxColor.hue() / 360) || this.HBox.offsetHeight));
        },

        getSSelectorPosition: function () {

            return this.SVBox.offsetWidth * this.currentColor.saturationv();
        },

        getVSelectorPosition: function () {

            return this.SVBox.offsetHeight * (1 - this.currentColor.value());
        },

        activateSelector: function(e, type) {

            var eventData = U.eventData(e);

            if (eventData.pointers > 1) {

                Ractive.$win.off("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS + " mouseup." + this.EVENT_NS + " touchend." + this.EVENT_NS)

                clearTimeout(this[type === "SV" ? "moveSVToPositionTimeout"   : "moveHToPositionTimeout"]);

                return;
            }

            var movedToPosition = false,

                selector              = type === "SV" ? ".ColorPicker--SV-selector" : ".ColorPicker--H-selector",
                moveToPositionTimeout = type === "SV" ? "moveSVToPositionTimeout"   : "moveHToPositionTimeout",
                moveSelectorFn        = type === "SV" ? "moveSVSelector"            : "moveHSelector",
                dataSelector          = type === "SV" ? "SVSelector"                : "HSelector",

                $selector = $(eventData.target).closest(selector),

                selectorPosition = $selector.position(),

                initPositions = {};

            initPositions.pointerY = eventData.clientY;
            initPositions.pointerX = eventData.clientX;

            initPositions.handleY = this.get(dataSelector + ".y");

            if (type === "SV") {

                initPositions.handleX = this.get(dataSelector + ".x");
            }

            initPositions.startOffsetX = eventData.offsetX;
            initPositions.startOffsetY = eventData.offsetY;

            //událost vznikla na selektoru - je potřeba upravit pozici
            if ($selector.length) {

                initPositions.startOffsetX += selectorPosition.left;
                initPositions.startOffsetY += selectorPosition.top;
            }

            var moveToStartEventPosition = function (animate, byEndEvent) {

                var args = [initPositions.startOffsetY, animate];

                if (type === "SV") {

                    args.unshift(initPositions.startOffsetX);
                }

                this[moveSelectorFn].apply(this, args);

                if (!byEndEvent) {

                    if (type === "SV") {

                        initPositions.handleY = this.getVSelectorPosition();
                        initPositions.handleX = this.getSSelectorPosition();

                    } else {

                        initPositions.handleY = this.getHSelectorPosition();
                    }
                }

                movedToPosition = true;

            }.bind(this);

            clearTimeout(this[moveToPositionTimeout]);

            //pokud uživatel nepohne myší/prstem => přesunout na místo
            this[moveToPositionTimeout] = setTimeout(moveToStartEventPosition.bind(this, true), eventData.isTouchEvent ? 200 : 100);

            Ractive.$win
                .off("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS + " mouseup." + this.EVENT_NS + " touchend." + this.EVENT_NS)
                .on("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS, function (e) {

                    var eventData = U.eventData(e);

                    if (eventData.pointers > 1) {

                        clearTimeout(this[moveToPositionTimeout]);

                        Ractive.$win.off("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS + " mouseup." + this.EVENT_NS + " touchend." + this.EVENT_NS)

                        return;
                    }

                    if (!movedToPosition) {

                        clearTimeout(this[moveToPositionTimeout]);

                        //nejdříve je potřeba přesunout selektor na pozici myši/prstu
                        moveToStartEventPosition();
                    }

                    var args = [
                        initPositions.handleY + eventData.clientY - initPositions.pointerY
                    ];

                    if (type === "SV") {

                        args.unshift(initPositions.handleX + eventData.clientX - initPositions.pointerX);
                    }

                    this[moveSelectorFn].apply(this, args);

                    e.preventDefault();
                    return false;

                }.bind(this))
                .one("mouseup." + this.EVENT_NS + " touchend." + this.EVENT_NS, function (e) {

                    if (!movedToPosition) {

                        clearTimeout(this[moveToPositionTimeout]);

                        moveToStartEventPosition(true, true);
                    }

                    Ractive.$win.off("mousemove." + this.EVENT_NS + " touchmove." + this.EVENT_NS);

                    e.preventDefault();
                    return false;

                }.bind(this));

            eventData.preventDefault();
            return false;
        },

        validateRGB: function (color) {

            return /^\s*rgb\(\s*(?:\d{1,3})\s*,\s*(?:\d{1,3})\s*,\s*(?:\d{1,3})\s*\)\s*$/.test(color);
        },

        validateHEX: function (color) {

            return /^\s*#?[0-9a-f]{6}\s*$/i.test(color);
        },

        inputTextHEXChanged: function () {

            var currentHEX = this.get("inputTextHEX");

            if (this.validateHEX(currentHEX)) {

                this.setColor(~currentHEX.indexOf("#") ? currentHEX : "#" + currentHEX, true);

            } else {

                var hash = currentHEX.indexOf("#"),
                    ch = currentHEX.length;

                //zkrátit příliš dlouhou hodnotu
                if ((ch > 6 && !~hash) || (ch > 7 && ~hash)) {

                    currentHEX = currentHEX.substr(0, 7 + currentHEX.indexOf("#"));

                    ch = currentHEX.length - 1;
                }

                //písmena "větší" než f změnit na f
                for (--ch; ch >= 0; ch--) {

                    if (currentHEX[ch] !== "#" && isNaN(parseInt(currentHEX[ch], 16))) {

                        currentHEX = currentHEX.substr(0, ch) + "f" + currentHEX.substr(ch + 1);
                    }
                }

                this.set("inputTextHEX", currentHEX);

                if (this.validateHEX(currentHEX)) {

                    this.setColor(~hash ? currentHEX : "#" + currentHEX, true);
                }
            }
        },

        inputTextRGBChanged: function () {

            var red = this.get("inputTextR"),
                green = this.get("inputTextG"),
                blue = this.get("inputTextB");

            if (red === "" || green === "" || blue === "") {

                return;
            }

            var currentRGB = "rgb(" + red + ", " + green + ", " + blue + ")";

            if (this.validateRGB(currentRGB)) {

                this.setColor(currentRGB, true);

            } else {

                red = Math.min(255, Math.max(0, red));
                green = Math.min(255, Math.max(0, green));
                blue = Math.min(255, Math.max(0, blue));

                this.set("inputTextR", red || 0);
                this.set("inputTextG", green || 0);
                this.set("inputTextB", blue || 0);

                this.inputTextRGBChanged();
            }
        }

    });

}));
