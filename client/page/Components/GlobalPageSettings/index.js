/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
var Ractive = require("ractive"),

    ColorPicker = require("./../../../libs/Components/ColorPicker"),
    ColorPickerPalette = require("./../../../libs/Components/ColorPicker/Components/ColorPickerPalette");

module.exports = Ractive.extend({

    template: require("./index.tpl"),

    OPTIONS: {
        ANIMATIONS: {

        }
    },

    components: {
        ColorPicker: ColorPicker,
        ColorPickerPalette: ColorPickerPalette
    },

    partials: {
        fontSettings: require("./partials/font-settings.tpl"),
        colorPaletteSettings: require("./partials/color-palette-settings.tpl")
    },

    data: function () {

        return {
            fontTypes: {
                "P_font-type-1" : {
                    title: "Serif",
                    body: "Serif"
                },
                "P_font-type-2" : {
                    title: "Sans Serif",
                    body: "Sans Serif"
                },
                "P_font-type-3" : {
                    title: "Serif",
                    body: "Serif"
                },
                "P_font-type-4" : {
                    title: "Sans Serif",
                    body: "Sans Serif"
                }
            },

            colorPalettes: [
                {
                    colors: [
                        "rgb(13, 51, 15)",
                        "rgb(1, 114, 1)",
                        "rgb(134, 174, 34)",
                        "rgb(188, 201, 0)",
                        "rgb(55, 41, 33)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(17, 23, 40)",
                        "rgb(41, 75, 119)",
                        "rgb(131, 151, 167)",
                        "rgb(137, 171, 173)",
                        "rgb(221, 221, 219)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(219, 96, 93)",
                        "rgb(230, 131, 43)",
                        "rgb(248, 221, 93)",
                        "rgb(243, 232, 229)",
                        "rgb(88, 187, 137)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(68, 57, 41)",
                        "rgb(143, 91, 58)",
                        "rgb(232, 218, 204)",
                        "rgb(73, 109, 131)",
                        "rgb(41, 62, 79)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(116,0,1)",
                        "rgb(174,0,1)",
                        "rgb(238,186,48)",
                        "rgb(211,166,37)",
                        "rgb(0,0,0)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(54,76,74)",
                        "rgb(73,124,127)",
                        "rgb(146,197,192)",
                        "rgb(133,129,104)",
                        "rgb(204,188,165)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(31,112,10)",
                        "rgb(121,204,60)",
                        "rgb(212,225,120)",
                        "rgb(230,213,195)",
                        "rgb(172,135,93)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(216,181,151)",
                        "rgb(140,64,6)",
                        "rgb(182,105,15)",
                        "rgb(227,197,127)",
                        "rgb(255,237,190)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(239, 244, 244)",
                        "rgb(248, 233, 217)",
                        "rgb(239, 201, 205)",
                        "rgb(202, 173, 182)",
                        "rgb(104, 113, 127)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(209, 237, 211)",
                        "rgb(180, 215, 195)",
                        "rgb(59, 68, 42)",
                        "rgb(105, 105, 68)",
                        "rgb(238, 151, 182)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(255, 200, 87)",
                        "rgb(233, 114, 76)",
                        "rgb(197, 40, 61)",
                        "rgb(72, 29, 36)",
                        "rgb(37, 95, 133)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(158,158,158)",
                        "rgb(96,125,139)",
                        "rgb(255,87,34)",
                        "rgb(255,255,255)",
                        "rgb(0,0,0)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(246,31,86)",
                        "rgb(190,19,63)",
                        "rgb(43,40,40)",
                        "rgb(26,22,22)",
                        "rgb(6,0,0)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(236,205,156)",
                        "rgb(177,112,112)",
                        "rgb(117,40,44)",
                        "rgb(73,4,21)",
                        "rgb(6,0,0)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(225,178,65)",
                        "rgb(219,133,3)",
                        "rgb(212,44,69)",
                        "rgb(126,7,61)",
                        "rgb(34,2,33)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(204,182,214)",
                        "rgb(154,148,182)",
                        "rgb(40,38,80)",
                        "rgb(5,26,52)",
                        "rgb(0,2,19)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(251,214,62)",
                        "rgb(255,165,53)",
                        "rgb(244,118,13)",
                        "rgb(225,65,10)",
                        "rgb(45,43,60)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(160,208,185)",
                        "rgb(189,214,183)",
                        "rgb(208,219,179)",
                        "rgb(222,229,184)",
                        "rgb(249,255,198)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(156,145,140)",
                        "rgb(176,164,151)",
                        "rgb(191,170,150)",
                        "rgb(255,252,181)",
                        "rgb(116,110,105)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(231,76,60)",
                        "rgb(33,47,60)",
                        "rgb(19,180,148)",
                        "rgb(255,255,255)",
                        "rgb(203,203,203)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(31,31,31)",
                        "rgb(243,40,40)",
                        "rgb(11,71,89)",
                        "rgb(235,235,235)",
                        "rgb(164,155,98)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(250, 234, 149)",
                        "rgb(252, 184, 95)",
                        "rgb(236, 168, 175)",
                        "rgb(194, 234, 214)",
                        "rgb(16, 18, 13)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(55, 33, 24)",
                        "rgb(136, 80, 23)",
                        "rgb(249, 233, 54)",
                        "rgb(188, 205, 156)",
                        "rgb(103, 143, 87)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(241, 52, 1)",
                        "rgb(250, 122, 51)",
                        "rgb(254, 166, 108)",
                        "rgb(96, 113, 59)",
                        "rgb(45, 57, 35)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(0, 14, 23)",
                        "rgb(1, 65, 95)",
                        "rgb(83, 209, 238)",
                        "rgb(254, 210, 12)",
                        "rgb(195, 119, 64)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(206, 73, 128)",
                        "rgb(245, 192, 203)",
                        "rgb(246, 233, 224)",
                        "rgb(82, 117, 30)",
                        "rgb(0, 0, 0)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(62, 108, 2)",
                        "rgb(150, 221, 30)",
                        "rgb(221, 255, 60)",
                        "rgb(128, 127, 107)",
                        "rgb(59, 58, 50)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(42, 41, 42)",
                        "rgb(98, 103, 130)",
                        "rgb(201, 180, 206)",
                        "rgb(236, 217, 192)",
                        "rgb(196, 157, 77)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(205, 61, 139)",
                        "rgb(255, 171, 207)",
                        "rgb(33, 164, 162)",
                        "rgb(1, 100, 76)",
                        "rgb(104, 167, 40)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(30, 32, 17)",
                        "rgb(158, 36, 61)",
                        "rgb(231, 104, 124)",
                        "rgb(255, 204, 0)",
                        "rgb(225, 150, 0)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(255, 219, 211)",
                        "rgb(255, 236, 219)",
                        "rgb(198, 181, 191)",
                        "rgb(113, 123, 142)",
                        "rgb(45, 52, 49)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(39, 9, 15)",
                        "rgb(92, 46, 61)",
                        "rgb(169, 86, 94)",
                        "rgb(138, 119, 131)",
                        "rgb(167, 145, 157)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(62, 31, 22)",
                        "rgb(148, 2, 20)",
                        "rgb(221, 57, 90)",
                        "rgb(232, 192, 1)",
                        "rgb(1, 92, 122)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(4, 2, 3)",
                        "rgb(1, 10, 61)",
                        "rgb(70, 123, 141)",
                        "rgb(67, 189, 142)",
                        "rgb(225, 254, 164)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(30, 40, 42)",
                        "rgb(147, 229, 242)",
                        "rgb(230, 239, 236)",
                        "rgb(177, 0, 21)",
                        "rgb(80, 0, 9)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(224, 197, 97)",
                        "rgb(240, 225, 186)",
                        "rgb(244, 245, 249)",
                        "rgb(222, 131, 91)",
                        "rgb(144, 35, 10)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(166, 24, 26)",
                        "rgb(234, 150, 124)",
                        "rgb(237, 200, 148)",
                        "rgb(241, 241, 207)",
                        "rgb(127, 125, 51)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(210, 177, 63)",
                        "rgb(182, 162, 96)",
                        "rgb(197, 189, 166)",
                        "rgb(165, 161, 155)",
                        "rgb(89, 86, 82)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(182, 49, 107)",
                        "rgb(206, 118, 157)",
                        "rgb(206, 173, 175)",
                        "rgb(232, 224, 220)",
                        "rgb(255, 255, 255)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(150, 72, 43)",
                        "rgb(253, 162, 121)",
                        "rgb(231, 221, 200)",
                        "rgb(135, 132, 96)",
                        "rgb(102, 105, 102)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(89, 14, 24)",
                        "rgb(79, 57, 56)",
                        "rgb(252, 248, 243)",
                        "rgb(224, 237, 245)",
                        "rgb(199, 202, 204)"
                    ],
                    headerImg: ""
                },
                {
                    colors: [
                        "rgb(0, 0, 63)",
                        "rgb(1, 0, 142)",
                        "rgb(144, 1, 245)",
                        "rgb(254, 0, 234)",
                        "rgb(255, 1, 120)"
                    ],
                    headerImg: ""
                }
            ]
        };
    },

    onrender: function () {

    },

    onconfig: function () {

        this.on("ColorPicker.*", function (data) {

            if (data && typeof data === "object" && data.key === "current") {

                var state = !data.context.get("animate");

                this.parent.forEachPageSection(function (section) {

                    section.set("stopColorTransitions", state);
                });
            }
        });

        this.observe("settings.colorPalette", function (newValue, oldValue) {

            if (newValue !== oldValue) {

                this.parent.forEachPageSection(function (section) {

                    section.set("stopColorTransitions", false);
                });
            }
        }, {init: false});
    },

    oncomplete: function () {

    },

    onteardown: function () {

    }

});
