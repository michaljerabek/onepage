(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){module.exports = function () {};},{}],2:[function(require,module,exports){

/*
  Vibrant.js
  by Jari Zwarts

  Color algorithm class that finds variations on colors in an image.

  Credits
  --------
  Lokesh Dhakar (http://www.lokeshdhakar.com) - Created ColorThief
  Google - Palette support library in Android
 */

(function() {
  var CanvasImage, Swatch, Vibrant,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    slice = [].slice;

  window.Swatch = Swatch = (function() {
    Swatch.prototype.hsl = void 0;

    Swatch.prototype.rgb = void 0;

    Swatch.prototype.population = 1;

    Swatch.yiq = 0;

    function Swatch(rgb, population) {
      this.rgb = rgb;
      this.population = population;
    }

    Swatch.prototype.getHsl = function() {
      if (!this.hsl) {
        return this.hsl = Vibrant.rgbToHsl(this.rgb[0], this.rgb[1], this.rgb[2]);
      } else {
        return this.hsl;
      }
    };

    Swatch.prototype.getPopulation = function() {
      return this.population;
    };

    Swatch.prototype.getRgb = function() {
      return this.rgb;
    };

    Swatch.prototype.getHex = function() {
      return "#" + ((1 << 24) + (this.rgb[0] << 16) + (this.rgb[1] << 8) + this.rgb[2]).toString(16).slice(1, 7);
    };

    Swatch.prototype.getTitleTextColor = function() {
      this._ensureTextColors();
      if (this.yiq < 200) {
        return "#fff";
      } else {
        return "#000";
      }
    };

    Swatch.prototype.getBodyTextColor = function() {
      this._ensureTextColors();
      if (this.yiq < 150) {
        return "#fff";
      } else {
        return "#000";
      }
    };

    Swatch.prototype._ensureTextColors = function() {
      if (!this.yiq) {
        return this.yiq = (this.rgb[0] * 299 + this.rgb[1] * 587 + this.rgb[2] * 114) / 1000;
      }
    };

    return Swatch;

  })();

  window.Vibrant = Vibrant = (function() {
    Vibrant.prototype.quantize = require('quantize');

    Vibrant.prototype._swatches = [];

    Vibrant.prototype.TARGET_DARK_LUMA = 0.26;

    Vibrant.prototype.MAX_DARK_LUMA = 0.45;

    Vibrant.prototype.MIN_LIGHT_LUMA = 0.55;

    Vibrant.prototype.TARGET_LIGHT_LUMA = 0.74;

    Vibrant.prototype.MIN_NORMAL_LUMA = 0.3;

    Vibrant.prototype.TARGET_NORMAL_LUMA = 0.5;

    Vibrant.prototype.MAX_NORMAL_LUMA = 0.7;

    Vibrant.prototype.TARGET_MUTED_SATURATION = 0.3;

    Vibrant.prototype.MAX_MUTED_SATURATION = 0.4;

    Vibrant.prototype.TARGET_VIBRANT_SATURATION = 1;

    Vibrant.prototype.MIN_VIBRANT_SATURATION = 0.35;

    Vibrant.prototype.WEIGHT_SATURATION = 3;

    Vibrant.prototype.WEIGHT_LUMA = 6;

    Vibrant.prototype.WEIGHT_POPULATION = 1;

    Vibrant.prototype.VibrantSwatch = void 0;

    Vibrant.prototype.MutedSwatch = void 0;

    Vibrant.prototype.DarkVibrantSwatch = void 0;

    Vibrant.prototype.DarkMutedSwatch = void 0;

    Vibrant.prototype.LightVibrantSwatch = void 0;

    Vibrant.prototype.LightMutedSwatch = void 0;

    Vibrant.prototype.HighestPopulation = 0;

    function Vibrant(sourceImage, colorCount, quality, unprocessed) {
      this.swatches = bind(this.swatches, this);
      var a, allPixels, b, cmap, g, i, image, imageData, offset, pixelCount, pixels, r;
      if (typeof colorCount === 'undefined') {
        colorCount = 64;
      }
      if (typeof quality === 'undefined') {
        quality = 5;
      }
      image = new CanvasImage(sourceImage);
      imageData = image.getImageData();
      pixels = imageData.data;
      pixelCount = image.getPixelCount();

      var worker = new Worker("VibrantWorker.js");

      worker.postMessage({
          imageData: imageData,
          pixelCount: pixelCount,
          quality: quality,
          pixels: pixels,
          colorCount: colorCount
      });

      if (unprocessed) {
        return {
          promise: new Promise(function (resolve) {

            worker.onmessage = function (message) {

              this._swatches = [];

              for (var s = message.data.length - 1; s >= 0; s--) {

                this._swatches.push(new Swatch(message.data[s].rgb, message.data[s].population));
              }

              image.removeCanvas();

              resolve(this._swatches);

            }.bind(this);

          }.bind(this)),

          stop: function () {

            worker.terminate();
          }
        };
      }

      return {
        promise: new Promise(function (resolve) {

          worker.onmessage = function (message) {

            this._swatches = message.data;

            this.maxPopulation = this.findMaxPopulation;
            this.generateVarationColors();
            this.generateEmptySwatches();

            image.removeCanvas();

            resolve(this);

          }.bind(this);

        }.bind(this)),

        stop: function () {

          worker.terminate();
        }
      };

    }

    Vibrant.prototype.generateVarationColors = function() {
      this.VibrantSwatch = this.findColorVariation(this.TARGET_NORMAL_LUMA, this.MIN_NORMAL_LUMA, this.MAX_NORMAL_LUMA, this.TARGET_VIBRANT_SATURATION, this.MIN_VIBRANT_SATURATION, 1);
      this.LightVibrantSwatch = this.findColorVariation(this.TARGET_LIGHT_LUMA, this.MIN_LIGHT_LUMA, 1, this.TARGET_VIBRANT_SATURATION, this.MIN_VIBRANT_SATURATION, 1);
      this.DarkVibrantSwatch = this.findColorVariation(this.TARGET_DARK_LUMA, 0, this.MAX_DARK_LUMA, this.TARGET_VIBRANT_SATURATION, this.MIN_VIBRANT_SATURATION, 1);
      this.MutedSwatch = this.findColorVariation(this.TARGET_NORMAL_LUMA, this.MIN_NORMAL_LUMA, this.MAX_NORMAL_LUMA, this.TARGET_MUTED_SATURATION, 0, this.MAX_MUTED_SATURATION);
      this.LightMutedSwatch = this.findColorVariation(this.TARGET_LIGHT_LUMA, this.MIN_LIGHT_LUMA, 1, this.TARGET_MUTED_SATURATION, 0, this.MAX_MUTED_SATURATION);
      return this.DarkMutedSwatch = this.findColorVariation(this.TARGET_DARK_LUMA, 0, this.MAX_DARK_LUMA, this.TARGET_MUTED_SATURATION, 0, this.MAX_MUTED_SATURATION);
    };

    Vibrant.prototype.generateEmptySwatches = function() {
      var hsl;
      if (this.VibrantSwatch === void 0) {
        if (this.DarkVibrantSwatch !== void 0) {
          hsl = this.DarkVibrantSwatch.getHsl();
          hsl[2] = this.TARGET_NORMAL_LUMA;
          this.VibrantSwatch = new Swatch(Vibrant.hslToRgb(hsl[0], hsl[1], hsl[2]), 0);
        }
      }
      if (this.DarkVibrantSwatch === void 0) {
        if (this.VibrantSwatch !== void 0) {
          hsl = this.VibrantSwatch.getHsl();
          hsl[2] = this.TARGET_DARK_LUMA;
          return this.DarkVibrantSwatch = new Swatch(Vibrant.hslToRgb(hsl[0], hsl[1], hsl[2]), 0);
        }
      }
    };

    Vibrant.prototype.findMaxPopulation = function() {
      var j, len, population, ref, swatch;
      population = 0;
      ref = this._swatches;
      for (j = 0, len = ref.length; j < len; j++) {
        swatch = ref[j];
        population = Math.max(population, swatch.getPopulation());
      }
      return population;
    };

    Vibrant.prototype.findColorVariation = function(targetLuma, minLuma, maxLuma, targetSaturation, minSaturation, maxSaturation) {
      var j, len, luma, max, maxValue, ref, sat, swatch, value;
      max = void 0;
      maxValue = 0;
      ref = this._swatches;

      for (j = 0, len = ref.length; j < len; j++) {
        swatch = ref[j];
          sat = Swatch.prototype.getHsl.call(swatch)[1];
          luma = Swatch.prototype.getHsl.call(swatch)[2];
        if (sat >= minSaturation && sat <= maxSaturation && luma >= minLuma && luma <= maxLuma && !this.isAlreadySelected(swatch)) {
            value = this.createComparisonValue(sat, targetSaturation, luma, targetLuma, Swatch.prototype.getPopulation.call(swatch), this.HighestPopulation);
          if (max === void 0 || value > maxValue) {
            max = swatch;
            maxValue = value;
          }
        }
      }

      if (!max) {
        return max;
      }

      var realSwatch = new Swatch(max.rgb, max.population);
      realSwatch.hsl = max.hsl;

      return realSwatch;
    };

    Vibrant.prototype.createComparisonValue = function(saturation, targetSaturation, luma, targetLuma, population, maxPopulation) {
      return this.weightedMean(this.invertDiff(saturation, targetSaturation), this.WEIGHT_SATURATION, this.invertDiff(luma, targetLuma), this.WEIGHT_LUMA, population / maxPopulation, this.WEIGHT_POPULATION);
    };

    Vibrant.prototype.invertDiff = function(value, targetValue) {
      return 1 - Math.abs(value - targetValue);
    };

    Vibrant.prototype.weightedMean = function() {
      var i, sum, sumWeight, value, values, weight;
      values = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      sum = 0;
      sumWeight = 0;
      i = 0;
      while (i < values.length) {
        value = values[i];
        weight = values[i + 1];
        sum += value * weight;
        sumWeight += weight;
        i += 2;
      }
      return sum / sumWeight;
    };

    Vibrant.prototype.swatches = function() {
      return {
        Vibrant: this.VibrantSwatch,
        Muted: this.MutedSwatch,
        DarkVibrant: this.DarkVibrantSwatch,
        DarkMuted: this.DarkMutedSwatch,
        LightVibrant: this.LightVibrantSwatch,
        LightMuted: this.LightMuted
      };
    };

    Vibrant.prototype.isAlreadySelected = function(swatch) {
      return this.VibrantSwatch === swatch || this.DarkVibrantSwatch === swatch || this.LightVibrantSwatch === swatch || this.MutedSwatch === swatch || this.DarkMutedSwatch === swatch || this.LightMutedSwatch === swatch;
    };

    Vibrant.rgbToHsl = function(r, g, b) {
      var d, h, l, max, min, s;
      r /= 255;
      g /= 255;
      b /= 255;
      max = Math.max(r, g, b);
      min = Math.min(r, g, b);
      h = void 0;
      s = void 0;
      l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
        }
        h /= 6;
      }
      return [h, s, l];
    };

    Vibrant.hslToRgb = function(h, s, l) {
      var b, g, hue2rgb, p, q, r;
      r = void 0;
      g = void 0;
      b = void 0;
      hue2rgb = function(p, q, t) {
        if (t < 0) {
          t += 1;
        }
        if (t > 1) {
          t -= 1;
        }
        if (t < 1 / 6) {
          return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
          return q;
        }
        if (t < 2 / 3) {
          return p + (q - p) * (2 / 3 - t) * 6;
        }
        return p;
      };
      if (s === 0) {
        r = g = b = l;
      } else {
        q = l < 0.5 ? l * (1 + s) : l + s - (l * s);
        p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - (1 / 3));
      }
      return [r * 255, g * 255, b * 255];
    };

    return Vibrant;

  })();


  /*
    CanvasImage Class
    Class that wraps the html image element and canvas.
    It also simplifies some of the canvas context manipulation
    with a set of helper functions.
    Stolen from https://github.com/lokesh/color-thief
   */

  window.CanvasImage = CanvasImage = (function() {
    function CanvasImage(image) {
      this.iframe = document.createElement('iframe');
      this.iframe.className = 'VibrantCanvas';
      document.body.appendChild(this.iframe);

      var doc = this.iframe.contentWindow.document;


//      this.canvas = document.createElement('canvas');
      this.canvas = doc.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      doc.body.appendChild(this.canvas);
//      document.body.appendChild(this.canvas);
      this.width = this.canvas.width = image.width;
      this.height = this.canvas.height = image.height;
      this.context.drawImage(image, 0, 0, this.width, this.height);
    }

    CanvasImage.prototype.clear = function() {
      return this.context.clearRect(0, 0, this.width, this.height);
    };

    CanvasImage.prototype.update = function(imageData) {
      return this.context.putImageData(imageData, 0, 0);
    };

    CanvasImage.prototype.getPixelCount = function() {
      return this.width * this.height;
    };

    CanvasImage.prototype.getImageData = function() {
      return this.context.getImageData(0, 0, this.width, this.height);
    };

    CanvasImage.prototype.removeCanvas = function() {
      this.iframe.parentNode.removeChild(this.iframe);
      return this.canvas.parentNode.removeChild(this.canvas);
    };

    return CanvasImage;

  })();

}).call(this);

},{"quantize":1}]},{},[2]);
