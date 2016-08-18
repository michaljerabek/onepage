/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/

(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var on = require("./../../../../helpers/on");
        var EventEmitter = require("./../../../libs/EventEmitter")();

        var Ractive = require("ractive"),
            Spectra = require("spectra");

        var components = {
                PageSectionMessage: Ractive.EDIT_MODE ? require("./PageSectionMessage") : null,
                ProgressBar: Ractive.EDIT_MODE ? require("./../../../libs/Components/ProgressBar") : null,

                PageSectionSettings: Ractive.EDIT_MODE ? require("./PageSectionSettings") : null,
                ColorSettings: Ractive.EDIT_MODE ? require("./PageSectionSettings/Types/ColorSettings") : null,
                BackgroundImageSettings: Ractive.EDIT_MODE ? require("./PageSectionSettings/Types/BackgroundImageSettings") : null,
                SectionSettings: Ractive.EDIT_MODE ? require("./PageSectionSettings/Types/SectionSettings") : null,

                PageElementSettings: Ractive.EDIT_MODE ? require("./../PageElement/PageElementSettings") : null,
                PageElementButtonSettings: Ractive.EDIT_MODE ? require("./../PageElement/PageElementSettings/Types/PageElementButtonSettings") : null,

                PageElement: require("./../PageElement"),
                PageElementText: require("./../PageElement/Types/PageElementText"),
                PageElementButton: require("./../PageElement/Types/PageElementButton"),
                PageElementImage: require("./../PageElement/Types/PageElementImage"),
                PageElementIcon: require("./../PageElement/Types/PageElementIcon"),
                PageElementNumber: require("./../PageElement/Types/PageElementNumber"),

                BackgroundImage: require("./Components/BackgroundImage")
            },

            partials = {
                pageSectionEditUI: "",
                pageSectionContent: "",
                pageSectionSettings: "",

                ColorSettings: Ractive.EDIT_MODE ? require("./partials/settings/color-settings.tpl") : null,

                PageSectionTitles: require("./partials/PageSectionTitles/index.tpl"),

                PageElementButtons: require("./../PageElement/Types/PageElementButton/PageSectionPartials/button-elements.tpl")
            },

            decorators = {
                Sortable: require("./Decorators/Sortable"),

                PageSectionTitles: require("./partials/PageSectionTitles/decorator"),

                PageElementButtons: require("./../PageElement/Types/PageElementButton/PageSectionDecorators/PageElementButtons")
            },

            template = require("./index.tpl");

        module.exports = factory(Ractive, Spectra, template, components, partials, decorators, EventEmitter, on);

    } else {

        root.PageSection = factory(root.Ractive, root.Spectra, null, null, null, $({}), {client: true});
    }

}(this, function (Ractive, Spectra, template, components, partials, decorators, EventEmitter, on) {

    /*
     * Abstraktní komponent pro vytváření sekcí.
     *
     * Konkrétný typ sekce musí v partials zaregistrovat v "pageSectionContent" obsah sekce,
     * v "pageSectionEditUI" ovládací prvky sekce (komponent rozšiřující PageSectionEditUI - registruje
     * se u konkrtétní sekce) a v "pageSectionSettings" šablona obsahující všechny PageSectionSettings.
     *
     * Šablona (partial) konkrétní sekce může obsahovat BackgroundImage. Pokud se obsah zarovnává do středu,
     * obsah (kromě BackgroundImage) by měl být zabalen do elementu "P_PageSection--center". Samotný obsah by pak měl být v "P_PageSection--content-wrapper" (přidává padding, pokud je obsah vycenrovaný).
     **/

    var outlineSpectra = Ractive.EDIT_MODE ? Spectra("#ef6737") : null;

    return Ractive.extend({

        PAGE_SECTION: true,

        template: template || "",

        CLASS: {
            self: "P_PageSection",
            hasSettings: "P_PageSection__has-settings",
            hasOutline: "P_PageSection__has-outline",

            innerWrapper: "P_PageSection--inner-wrapper",

            stopColorTransitions: "E_PageSection__stop-color-transitions",

            //Seřazování sekcí
            parentOfSortable: "P_sortable-sections",
            parentOfNonSortable: "P_nonsortable-sections",
            sortHandle: "P_PageSection--sort-handle",
            draggedSection: "P_PageSection__dragged",
            placedSection: "P_PageSection__placed",
            newSection: "P_PageSection__new",
            insertedByTap: "P_PageSection__inserted-by-tap",
            removedSection: "P_PageSection__removed",

            placeholderTransitions: "P_PageSection--placeholder__transitions",
            placeholderFake: "P_PageSection--fake-placeholder",
            placeholder: "P_PageSection--placeholder"
        },

        components: components || {},

        decorators: decorators || {},

        partials: partials || {},

        data: function () {

            return {
                editMode: Ractive.EDIT_MODE,
                stopColorTransitions: false,
                openPageSectionSettings: null
            };
        },

        superOnconfig: function () {

            if (Ractive.EDIT_MODE) {

                //při změně jména sekce změnit id
                this.nameObserver = this.observe("section.name", this.regenerateId, {init: false, defer: true});

                this.initPageElementSettings();
                this.initPageSectionSettings();

                this.on("*.dragenter dragenter", function () {

                    this.set("dragover", true);
                });

                this.on("*.dragleave dragleave *.dragend dragend", function () {

                    this.set("dragover", false);
                });

                //pokud je nastaven obrázek na pozadí, ale uživatel nevybral žádnou barvu pozadí,
                //nastavit jako pozadí výchozí, aby při změně výchozí palety nedošlo ke změně barvy
                //(barva bude vidět, než se načte obrázek)
                this.observe("section.backgroundImage.src", function (value) {

                    if (value && !this.get("section.backgroundColor")) {

                        this.set("section.backgroundColor", this.get("section.defaultColors.backgroundColor"));

                        this.set("section.defaultColors.backgroundColorRefByUser", false);
                    }
                }, {init: false});

                this.on("ColorPicker.*", function (data) {

                    if ((data && typeof data === "object" && data.key === "current") || data === "") {

                        this.set("stopColorTransitions", data ? !data.context.get("animate") : false);
                    }

                }.bind(this));

                //změnit barvu outlinu podle barvy pozadí
                this.observe("section.backgroundColor section.defaultColors.backgroundColor", function () {

                    clearTimeout(this.backgroundColorTimeout);

                    this.backgroundColorTimeout = setTimeout(function() {

                        var bg = this.get("section.backgroundColor") || this.get("section.defaultColors.backgroundColor");

                        this.set("changeOutlineColor", bg && outlineSpectra.near(Spectra(bg), 50));

                    }.bind(this), 100);
                });

                if (on.client) {

                    EventEmitter.on("removeLang.PageSection." + this.get("section.internalId"), this.removeLang.bind(this));
                    EventEmitter.on("langChanged.Page." + this.get("section.internalId"), function (e, lang, editMode) {

                        if (editMode) {

                            this.handleLangChanged.call(this, e, lang);
                        }
                    }.bind(this));

                    /************************************/
                    /*ZMĚNA BAREV*/
                    this.on("*.generateRandomColors", this.generateRandomColors.bind(this));

                    this.on("ColorPickerPalette.setColor", function (event, x, y, palette) {

                        //pouze ColorPicker v nastavení sekce
                        var parent = palette.container || palette.parent;

                        while (parent) {

                            if (parent.PAGE_ELEMENT) {

                                return;
                            }

                            parent = parent.parent;
                        }

                        var pathName = (palette.container || palette.parent).get("pathName");

                        if (!pathName) {

                            return;
                        }

                        //uživatel nastavuje vlastní barvu z výchozích -> uložit odkaz na barvu, aby se měnila v případě změny v paletě
                        if (palette.get("id") === "defaultColors") {

                            this.set("section.defaultColors." + pathName + "Ref", event.index.i);

                            //(1) odkaz na pozadí se používá pro získání všech ostatních barev,
                            //(1) proto je potřeba zachovávát odkaz neustále, že je nutné zjistit nastavení uživatelem jiným způsobem
                            if (pathName === "backgroundColor") {

                                this.set("section.defaultColors.backgroundColorRefByUser", true);
                            }

                        //(2) uživatel nastavuje vlastní barvu, které nepatří k výchozí paletě -> odstranit odkaz na barvu -> výchozí barva pak bude opět dynamická
                        //(2) pozadí je nutné řešit zvlášť -> viz (1)
                        } else if (pathName !== "backgroundColor") {

                            this.set("section.defaultColors." + pathName + "Ref", undefined);

                            //odkaz na barvu odstraněn -> najít výchozí barvu, která patří k výchozímu pozadí
                            var colorGenerator = this.Page.defaultColorsGenerator;

                            if (typeof this.get("section.defaultColors.backgroundColorRef") === "number") {

                                var method = "get" + pathName.charAt(0).toUpperCase() + pathName.slice(1);

                                if (colorGenerator[method]) {

                                    this.set("section.defaultColors." + pathName, colorGenerator[method](this.get("section.defaultColors.backgroundColorRef")));
                                }
                            }

                        //(3) uživatel mění barvu pozadí na nevýchozí barvu; viz také (1)
                        } else {

                            this.set("section.defaultColors.backgroundColorRefByUser", false);
                        }

                    }.bind(this));

                    //"ruční" nastavení barvy
                    this.on("ColorPicker.activated", function (colorPicker) {

                        //pouze ColorPicker v nastavení sekce
                        var parent = colorPicker.parent;

                        while (parent) {

                            if (parent.PAGE_ELEMENT) {

                                return;
                            }

                            parent = parent.parent;
                        }

                        var pathName = colorPicker.get("pathName");

                        if (!pathName) {

                            return;
                        }

                        //uživatel mění barvu na nevýchozí -> odstranit odkazy
                        //viz (2)
                        if (pathName !== "backgroundColor") {

                            this.set("section.defaultColors." + pathName + "Ref", undefined);

                            var colorGenerator = this.Page.defaultColorsGenerator;

                            if (typeof this.get("section.defaultColors.backgroundColorRef") === "number") {

                                var method = "get" + pathName.charAt(0).toUpperCase() + pathName.slice(1);

                                if (colorGenerator[method]) {

                                    this.set("section.defaultColors." + pathName, colorGenerator[method](this.get("section.defaultColors.backgroundColorRef")));
                                }
                            }
                        //(3)
                        } else {

                            this.set("section.defaultColors.backgroundColorRefByUser", false);
                        }

                    }.bind(this));
                }
                /************************************/
            }
        },

        superOninit: function () {

        },

        superOnrender: function () {

            if (Ractive.EDIT_MODE) {

                this.initEditUI();

                if (on.client) {

                    this.observe("section.layout", function (layout) {

                        this.forEachPageElement("fire", "layoutChanged", layout);

                        this.layoutObserverTimeout = setTimeout(function() {

                            this.changingLayout = false;

                            this.forEachPageElement("set", "stopTransition", false);

                            this.set("stopTransitions", false);

                        }.bind(this), 0);

                    }, {init: false, defer: true});

                    this.observe("section.layout", function () {

                        clearInterval(this.layoutObserverTimeout);

                        this.set("stopTransitions", true);

                        this.changingLayout = true;

                        this.forEachPageElement("set", "stopTransition", true);

                    }, {init: false});
                }

                this.get$SectionElement()
                    .on("dragenter.PageSection", function (event) {

                        if (!event.originalEvent.dataTransfer.types[0] ||
                            !event.originalEvent.dataTransfer.types[0].match(/file/i)) {

                            return;
                        }

                        this.fire("dragenter");

                    }.bind(this));

                //nastavit jako text odkazu hodnotu z name, pokud menuText žádný text neobsahuje
                this.observe("section.addToMenu", function (state) {

                    if (state) {

                        var menuText = this.get("section.menuText"),
                            langs = menuText ? Object.keys(menuText) : [];

                        if (!menuText || (langs.length === 1 && !menuText[langs[0]])) {

                            menuText = {};

                            $.each(this.get("section.name"), function (lang, text) {

                                menuText[lang] = text;

                            }.bind(this));

                            this.set("section.menuText", menuText);

                        } else if (!this.get("section.menuText." + this.get("lang"))) {

                            this.handleLangChanged(null, this.get("lang"), "menuText");
                        }
                    }

                }, {init: false});
            }
        },

        superOncomplete: function () {

            this.initialized = true;
        },

        initEditUI: function () {

            var EditUI,

                components = this.findAllComponents(),
                c = components.length - 1;

            for (c; c >= 0; c--) {

                if (components[c].EDIT_UI) {

                    EditUI = components[c];

                    break;
                }
            }

            this.EditUI = EditUI;
        },

        initPageElementSettings: function () {

            if (on.client) {

                //otevírá se nastavení elementu v sekci
                EventEmitter.on("openPageElementSettings.PageElement sortPageSection.PageSectionManager", function (e, state, pageElement) {

                    this.updateHasSettingsState(pageElement);

                }.bind(this));
            }

            this.on("*.sectionHasOutline", this.updateHasOutlineState.bind(this), {context: this});
        },

        initPageSectionSettings: function () {

            if (on.client) {

                //otevírá se nastavení sekce -> zavřít ostatní sekce
                EventEmitter.on("openPageSectionSettings.PageSection", function (e, pageSectionType) {

                    if (pageSectionType !== this) {

                        this.togglePageSectionSettings(false);
                    }
                }.bind(this));


                //Zjišťuje, jestli je jiné nastavení této sekce otevřené.
                //Pokud se otevírá nastavení sekce a jiné nastavení té samé sekce je už otevřené, nastavení se otevře až po zavření již otevřeného.
//                this.observe("openPageSectionSettings", function (now, before) {
//
//                    this.set("anotherSettingsOpened", !!before);
//
//                }, {init: false});

                //uživatel chce otevřít nastavení sekce
                this.on("*.openPageSectionSettings", function (event, type) {

                    type = type === this.get("openPageSectionSettings") ? false : type;

                    this.togglePageSectionSettings(type);

                    if (type) {

                        EventEmitter.trigger("openPageSectionSettings.PageSection", this);
                    }
                });

                //Uživatel kliknul na "zavřít" v nastavení.
                this.on("*.closeThisSectionSettings", this.togglePageSectionSettings.bind(this, false));

            }
        },

        superOnteardown: function () {

            this.EditUI = null;

            clearInterval(this.layoutObserverTimeout);
            clearTimeout(this.backgroundColorTimeout);

            this.off("PageSectionSettings.closeThisSettings");
            this.off("PageSectionEditUI.openPageSectionSettings");
            this.off("*.sectionHasOutline");

            EventEmitter.off("change.DefaultColorsGenerator." + this.get("section.internalId"));
            EventEmitter.off("removeLang.PageSection." + this.get("section.internalId"));
            EventEmitter.off("langChanged.Page." + this.get("section.internalId"));

            this.get$SectionElement()
                .off(".PageSection");
        },

        updateHasSettingsState: function (pageElement) {

            var state  = this.get("openPageSectionSettings") || (pageElement && pageElement.get("openPageElementSettings") && pageElement.getPageSection() === this);

            this.set("hasSettings", state);

            this.set("pageElementSettings", state && pageElement ? pageElement.get("type") : null);

            this.getSectionElement().classList[state ? "add" : "remove"](this.CLASS.hasSettings);
        },

        updateHasOutlineState: function (state) {

            if (Boolean(this.currentOutlineState) === Boolean(state)) {

                return;
            }

            this.currentOutlineState = this.find("." + this.components.PageElement.prototype.CLASS.outlineActive);

            this.set("hasOutline", this.currentOutlineState);

            EventEmitter.trigger("hasOutline.PageSection", [state, this.EditUI]);

            this.getSectionElement().classList[this.currentOutlineState ? "add" : "remove"](this.CLASS.hasOutline);
        },

        togglePageSectionSettings: function (state) {

            this.set("anotherSettingsOpened", !!this.get("openPageSectionSettings"));

            this.set("openPageSectionSettings", state);

            this.updateHasSettingsState();
        },

        regenerateId: function (newName) {

            if (this.skipRegenerateId || this.Page.skipRegenerateId) {

                return;
            }

            var lang = this.get("lang");

            if (typeof newName === "undefined" || typeof newName[lang] === "undefined") {

                return;
            }

            var builder = this.Page.pageSectionBuilder;

            if (!newName[lang]) {

                this.set("section.name." + lang, builder.getDefaultName(this.get("section.type")));

                return;
            }

            this.set("section.id." + lang, builder.generateId(newName[lang], lang));

            this.rewriteNameReferences(newName[lang]);
        },

        rewriteNameReferences: function (name) {

            var id = this.get("section.internalId");

            $("[value='#" + id + "'], [data-value='#" + id + "']").text(name);
        },

        /**
         * Logika změny barvy:
         * Nastaví-li uživatel novou paletu, jsou výchozí barvy kompletně přepsány náhodnou barvou z výchozích,
         * Odkaz na tuto barvu se udržuje v "section.defaultColors.backgroundColorRef" - z barvy pozadí se odvozují ostatní.
         * Pokud uživatel nastavil vlastní výchozí barvy, jsou tyto barvy přepsány novou paletou (resp. nastavení barev je odstraněno, aby se použily barvy výchozí).
         *
         * Pokud se mění pouze jedna barva, tak v případě, že existuje odkaz na výchozí barvu (uživatel vybral vlastní výchozí barvu),
         * se tato barva změní, pokud je změněna ve výchozí paletě, ale není dynamická (nemění se např. při změně pozadí na jinou).
         * Pokud odkaz neexistuje použije se dynamická barva patřící k pozadí.
         *
         * Vlastní barvy zůstavají vždy zachovány.
         */
        handleDefaultColorsChanged: function (colorGenerator, singleColorChanged, prevSection) {

            if (singleColorChanged) {

                this.handleSingleDefaultColorChanged(colorGenerator);

                return;
            }

            this.handleColorPaletteChanged(colorGenerator, prevSection);
        },

        handleSingleDefaultColorChanged: function (colorGenerator) {

            var defaultColors = this.get("section.defaultColors");

            if (defaultColors && typeof defaultColors.backgroundColorRef === "number") {

                //uživatel změnil barvu pozadí z výchozích barev -> použít výchozí a odstranit nastaveno barvu
                if (defaultColors && defaultColors.backgroundColorRefByUser) {

                    this.set("section.backgroundColor", "");
                }

                //výchozí barvy podle odkazu
                this.set("section.defaultColors.backgroundColor", colorGenerator.getColor(defaultColors.backgroundColorRef));

                //(1) uživatel změnil barvu textu (speciální) z výchozích -> použít výchozí z odkazu na tuto barvu a odstranit nastavenou
                //(1) pokud uživatel mění tuto barvu (v paletě) -> barva se bude měnit také, ale nebude se přizůsovovat
                if (defaultColors && typeof defaultColors.textColorRef === "number") {

                    this.set("section.textColor", "");
                    this.set("section.defaultColors.textColor", colorGenerator.getColor(defaultColors.textColorRef));

                    //(2) jestiže odkaz neexistuje, použije se dynamická barva patřící k pozadí
                } else {

                    this.set("section.defaultColors.textColor", colorGenerator.getTextColor(defaultColors.backgroundColorRef));
                }

                //viz (1)
                if (defaultColors && typeof defaultColors.specialColorRef === "number") {

                    this.set("section.specialColor", "");
                    this.set("section.defaultColors.specialColor", colorGenerator.getColor(defaultColors.specialColorRef));

                //viz (2)
                } else {

                    this.set("section.defaultColors.specialColor", colorGenerator.getSpecialColor(defaultColors.backgroundColorRef));
                }
            }
        },

        handleColorPaletteChanged: function (colorGenerator, prevSection) {

            var defaultColors = this.get("section.defaultColors");

            //v případě, že na jednotlivé barvy byly nastaveny odkazy (uživatel vybral barvu z výchozích),
            //tak se tyto barvy změní s paletou (odstraní se nastavené barvy)
            if (defaultColors && typeof defaultColors.textColorRef === "number") {

                this.set("section.textColor", "");
            }

            if (defaultColors && typeof defaultColors.specialColorRef === "number") {

                this.set("section.specialColor", "");
            }

            if (defaultColors && defaultColors.backgroundColorRefByUser) {

                this.set("section.backgroundColor", "");
            }

            if (defaultColors) {

                this.forEachPageElement(function () {

                    if (this.removeColorRefs) {

                        this.removeColorRefs();
                    }
                });
            }

            /**************************************/
            //pokud má předcházející sekce stejnou barvu pozadí, vybrat jinou
            var colors, thisRef,

                prevRef = prevSection ? prevSection.get("section.defaultColors.backgroundColorRef") : null;

            do {

                colors = colorGenerator.getColors();

                thisRef = colors.backgroundColorRef;

            } while (thisRef === prevRef);
            /**************************************/

            this.set("section.defaultColors", colors);
        },

        generateRandomColors: function (checkAfterAndBefore, stopTransitions) {

            if (typeof checkAfterAndBefore === "object") {

                checkAfterAndBefore = false;
            }

            var colorPaths = this.getColorPaths(),
                p = colorPaths .length - 1;

            for (p; p >= 0; p--) {

                this.set("section." + colorPaths[p], "");
            }

            var allSections, afterRef, beforeRef, s;

            if (checkAfterAndBefore) {

                allSections = this.findParent("Page").pageSectionsManager.getSectionsSortedByIndex(true);

                s = allSections.length - 1;

                for (s; s >= 0; s--) {

                    if (allSections[s] === this) {

                        //předchozí sekce
                        if (allSections[s - 1]) {

                            beforeRef = allSections[s - 1].get("section.defaultColors.backgroundColorRef");

                        }
                        //následující sekce
                        if (allSections[s + 1]) {

                            afterRef = allSections[s + 1].get("section.defaultColors.backgroundColorRef");
                        }
                    }
                }
            }

            var colorGenerator = this.findParent("Page").defaultColorsGenerator,

                colors,

                lastRef = this.get("section.defaultColors.backgroundColorRef"),
                thisRef;

            do {

                colors = colorGenerator.getColors();

                thisRef = colors.backgroundColorRef;

            } while ((thisRef === lastRef) || (checkAfterAndBefore && (thisRef === afterRef || thisRef === beforeRef)));

            this.set("stopColorTransitions", !!stopTransitions);

            this.set("section.defaultColors", colors);
        },

        handleHover: function (event) {

            if (this.EditUI) {

                this.EditUI.fire("hover", event, this);
            }
        },

        //uživatel se dotknul sekce -> zobrazit EditUI? -> handleTouchend
        handleTouchstart: function (event) {

            if (event.original.touches.length > 1 || !this.EditUI || this.EditUI.get("hover")) {

                return;
            }

            this.cancelTouchend = false;

            this.wasTouchstart = true;

            var initX = event.original.touches[0].pageX,
                initY = event.original.touches[0].pageY;

            Ractive.$win.on("touchmove.hover-PageSection", function (event) {

                this.cancelTouchend = Math.abs(initX - event.originalEvent.touches[0].pageX) > 5 ||
                    Math.abs(initY - event.originalEvent.touches[0].pageY) > 5;

            }.bind(this));
        },

        //předává informaci EditUI, že uživatel chce zobrazit UI
        handleTouchend: function (event) {

            Ractive.$win.off("touchmove.hover-PageSection");

            if (event.original.touches.length > 1) {

                return;
            }

            if (this.wasTouchstart && this.EditUI) {

                this.EditUI.fire("pageSectionTouchend", event, this, this.cancelTouchend);
            }

            this.wasTouchstart = false;
        },

        //Vrátí současnou pozici sekce na stránce.
        getCurrentIndex: function () {

            return this.get$SectionElement().index();
        },

        getSectionElement: function () {

            this.sectionElement = this.sectionElement || this.find("." + this.CLASS.self);

            return this.sectionElement;
        },

        get$SectionElement: function () {

            this.$sectionElement = this.$sectionElement || $(this.getSectionElement());

            return this.$sectionElement;
        },

        findPageElements: function () {

            var elements = [],

                components = this.findAllComponents(),
                c = components.length - 1;

            for (c; c >= 0; c--) {

                if (components[c].PAGE_ELEMENT) {

                    elements.unshift(components[c]);
                }
            }

            return elements;
        },

        forEachPageElement: function (fn/*, args...*/) {

            var elements = this.findPageElements(),
                e = elements.length - 1,

                args = Array.prototype.slice.call(arguments);

            args.shift();

            for (e; e >= 0; e--) {

                if (typeof fn === "string" && elements[e][fn]) {

                    elements[e][fn].apply(elements[e], args);

                } else if (typeof fn === "function") {

                    fn.apply(elements[e], elements[e]);
                }
            }
        },

        removeLang: function (e, lang) {

            var paths = this.getTextPaths(),
                p = paths.length - 1;

            for (p; p >= 0; p--) {

                var data = this.get("section." + paths[p]);

                if (typeof data === "object") {

                    delete data[lang];
                }
            }
        },

        getTextPaths: function () {

            var paths = ["name", "menuText"];

            var buttons = (this.get("section.buttons") || []).length;

            if (buttons) {

                for (--buttons; buttons >= 0; buttons--) {

                    paths.push("buttons." + buttons + ".text");
                }
            }

            return paths;
        },

        superGetColorPaths: function () {

            var paths = ["backgroundColor", "textColor"];

            var buttons = (this.get("section.buttons") || []).length;

            if (buttons) {

                for (--buttons; buttons >= 0; buttons--) {

                    paths.push("buttons." + buttons + ".color");
                    paths.push("buttons." + buttons + ".userTextColor");
                }
            }

            return paths;
        },

        getColorPaths: function () {

            return this.superGetColorPaths();
        },

        getColors: function () {

            var colorPaths = this.getColorPaths(),
                cP = colorPaths.length - 1,
                tempColor,

                colors = [];

            for (cP; cP >= 0; cP--) {

                tempColor = this.get(colorPaths[cP]);

                if (tempColor && !~colors.indexOf(tempColor)) {

                    colors.unshift(tempColor);
                }
            }

            return colors;
        },

        findLangToCopy: function (data, lang, defLang, lastUsed) {

            if (data[defLang]) {

                return defLang;
            }

            if (data[lastUsed]) {

                return lastUsed;
            }

            var langs = Object.keys(data),
                l = langs.length - 1;

            for (l; l >= 0; l--) {

                if (data[langs[l]]) {

                    return langs[l];
                }
            }

            return "cs";
        },

        handleLangChanged: function (e, lang, forPath) {

            var defLang = this.findParent("Page").get("page.settings.lang.defaultLang"),
                lastLang = "",

                paths = forPath ? [forPath] : this.getTextPaths(),
                p = paths.length - 1;

            for (p; p >= 0; p--) {

                var data = this.get("section." + paths[p]);

                if (typeof data === "object" && !data[lang]) {

                    var copyLang = this.findLangToCopy(data, lang, defLang, lastLang);

                    lastLang = copyLang;

                    if (paths[p] === "name") {

                        this.regenerateId(data[copyLang]);
                    }

                    this.set("section." + paths[p] + "." + lang, data[copyLang]);
                }
            }
        },
        
        findSectionImages: function () {
            
            var logo = this.Page.get("page.sections.0.menu.image");
            
            return [{
                src: logo,
                name: "Logo"
            }];
        }
    });

}));

