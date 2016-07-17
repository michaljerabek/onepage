/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/
/*global $*/
(function (root, factory) {

    if (typeof module === 'object' && module.exports) {

        var on = require("./../../../../helpers/on"),

            Ractive = require("ractive"),

            PageElementSettings = require("./PageElementSettings"),

            Dropzone = on.client ? require("dropzone") : function () {},

            U = require("./../../../libs/U"),
            EventEmitter = require("./../../../libs/EventEmitter")();

        module.exports = factory(
            Ractive,
            PageElementSettings,
            Dropzone,
            U,
            require("./index.tpl"),
            EventEmitter,
            on
        );

    } else {

        root.PageElement = factory(
            root.Ractive,
            root.PageElementSettings,
            root.Dropzone,
            root.U,
            "",
            $([]),
            {client: true}
        );
    }

}(this, function (Ractive, PageElementSettings, Dropzone, U, template, EventEmitter, on) {

    /*
     * Abstraktní (!) component pro vytváření editovatelných prvků na stránce.
     * Přídá outline a nastavovací tlačítka -> řízeno konkrétními komponenty.
     *
     * Konkrétní typ musí obsahovat data "type" označující typ PageElementu,
     * data "hasEditUI" označující, jestli má ovládací prvky a může obsahovat
     * "settingsTitle" nastavující titulek PageElementSettings.
     *
     * Konkrétní typ může obsahovat metodu isEmpty, která zjistí, jestli je element prázdný (Přidá se třída E_PageElement__empty).
     *
     * Konkrétní typ může nastavovat stav PageElementu nastavením vlastnosti "state", která by měla vycházet z
     * události "stateChange".
     *
     * Pokud element obsahuje nějaké reference na výchozí barvy, měl by implementovat metodu removeColorRefs,
     * která odkazy odstraní.
     */

    var instanceCounter = 0,

        hasMouseTouchStyles = false,

        //nastaví chování outlinu
        //Outline se zobrazuje nad obsahem, proto je potřeba mu přidat pointer-events: none.
        //Na dotykových zařízeních se nastaví po touchstart na konkrétním elementu (v styles.css),
        //při použití myši se nastaví pro všechny.
        setMouseTouchStyles = function (isMouseUsed) {

            if (isMouseUsed) {

                if (hasMouseTouchStyles) {

                    return;
                }

                var cssText = [
                    ".E_PageElement--outline { ",
                        "pointer-events: none;",
                    "}"
                ].join("");

                $("<style />")
                    .attr("id", "PageElement--mouse-touch")
                    .html(cssText)
                    .appendTo("head");

                hasMouseTouchStyles = true;

                return;
            }

            if (hasMouseTouchStyles) {

                $("#PageElement--mouse-touch").remove();

                hasMouseTouchStyles = false;
            }
        },

        hoverByTouch = false,
        hoverByTouchTimeout = null,

        throttleHoverByTouch = function () {

            hoverByTouch = true;

            clearTimeout(hoverByTouchTimeout);

            hoverByTouchTimeout = setTimeout(function() {

                hoverByTouch = false;

                setMouseTouchStyles(false);

                //Pokud se opět použije touchstart -> použít stylování pro dotyk. z.
                Ractive.$win
                    .off("touchstart.PageElement")
                    .one("touchstart.PageElement", function () {

                    setMouseTouchStyles(false);

                    hoverByTouch = true;

                }.bind(this));

            }, 5000);
        };

    return Ractive.extend({

        PAGE_ELEMENT: true,

        EventEmitter: EventEmitter,

        template: template,

        CLASS: {
            self: "P_PageElement",
            customFocus: "P_PageElement__focused",

            outline: "E_PageElement--outline", //při změně změnit i výše v "setMouseTouchStyles()"
            outlineActive: "E_PageElement--outline__active",

            sortButton: "E_PageElementEditUI--sort",

            notFileDragged: "dz-not-file",

            emptyParent: "has-empty-PageElement",
            activeParent: "has-active-PageElement"
        },

        OPTIONS: {

            DROPZONE: function () {

                return {
                    url: "/upload-file",
                    paramName: "file",

                    uploadMultiple: false,
                    acceptedFiles: "",
                    maxFilesize: 1,
                    parallelUploads: 5,

                    clickable: false,

                    dictInvalidFileType: "Nepodporovaný formát.",
                    dictFileTooBig: "Soubor je příliš velký ({{filesize}} MB). Velikost souboru může být maximálně {{maxFilesize}} MB.",
                    dictResponseError: "Soubor se nepodařilo nahrát (chyba: {{statusCode}})"
                };
            }
        },

        components: {
            PageElementSettings: Ractive.EDIT_MODE ? PageElementSettings : null
        },

        partials: {
            pageElementEditUI: "",
            pageElementContent: "",

            FlatButton: Ractive.EDIT_MODE ? require("./../../Components/UI/FlatButton/index.tpl") : null
        },

        data: function () {

            return {
                hover: false,
                editMode: Ractive.EDIT_MODE,
                openPageElementSettings: null,
                state: "inactive",

                stopTransition: false
            };
        },

        superOnconfig: function () {

            this.EVENT_NS = "PageElement-" + (++instanceCounter);

            this.PageSection = this.getPageSection();

            if (on.client) {

                Ractive.$win = Ractive.$win || $(window);

                this.$temp = $([null]);

                this.set("id", this.EVENT_NS);

                if (Ractive.EDIT_MODE) {

                    //umožnit otevřít nastavení elementu
                    this.initPageElementSettings();

                    //zachovat outline i při přetahování elementu
                    this.on("sortable", function () {

                        this.set("sorting", true);

                        Ractive.$win.one("mouseup.sorting-" + this.EVENT_NS + " touchend.sorting-" + this.EVENT_NS, function () {

                            this.set("sorting", false);

                            Ractive.$win.off(".sorting-" + this.EVENT_NS);

                        }.bind(this));

                    });

                    if (this.COLORABLE) {

                        this.initColorRefs();
                    }

                    if (this.PageSection.changingLayout) {

                        this.set("stopTransition", true);
                    }
                }
            }
        },

        initColorRefs: function () {

            this.on("ColorPickerPalette.setColor", function (event, x, y, palette) {

                var pathName = (palette.container || palette.parent).get("pathName");

                if (!pathName) {

                    return;
                }

                //uživatel nastavuje vlastní barvu z výchozích -> uložit odkaz na barvu, aby se měnila v případě změny v paletě
                if (palette.get("id") === "defaultColors") {

                    this.set("element." + pathName + "Ref", event.index.i);

                } else {

                    this.set("element." + pathName + "Ref", null);
                }

            }.bind(this));

            //"ruční" nastavení barvy
            this.on("ColorPicker.activated", function (colorPicker) {

                var pathName = colorPicker.get("pathName");

                if (!pathName) {

                    return;
                }

                this.set("element." + pathName + "Ref", null);

            }.bind(this));

        },

        initPageElementSettings: function () {

            if (on.client) {

                //otevírá se nastavení elementu v sekci -> zavřít nastavení v ostatních sekcích
                EventEmitter.on("openPageElementSettings.PageElement." + this.EVENT_NS + "sortPageSection.PageSectionManager." + this.EVENT_NS, function (e, state, pageSectionType) {

                    if (pageSectionType !== this) {

                        this.togglePageElementSettings(false);
                    }
                }.bind(this));
            }

            //uživatel otevírá nastavení elementu v sekci
            this.on("openPageElementSettings", function (event, type) {

                //element pro určení pozice nastavení
                this.set("pageElementSettingsPositionElement", event.node);

                type = type === this.get("openPageElementSettings") ? false : type;

                this.togglePageElementSettings(type);

                EventEmitter.trigger("openPageElementSettings.PageElement", [type, this]);
            });

            //Uživatel kliknul na "zavřít" v nastavení.
            this.on("*.closeThisSettings closeThisSettings", function () {

                this.togglePageElementSettings(false);

                EventEmitter.trigger("openPageElementSettings.PageElement", [false, this]);

            }.bind(this));
        },

        superOnrender: function () {

            if (on.client) {

                this.self = this.find("." + this.CLASS.self);
                this.$self = $(this.self);

                this.stateToParent = this.get("stateTo");

                if (Ractive.EDIT_MODE) {

                    this.initOutline();

                    if (on.client && this.get("uploadable")) {

                        this.initDragDropUpload();
                    }

                    if (this.stateToParent && this.isEmpty) {

                        this.observe("state", function (state) {

                            this.stateToParent.split(",").forEach(function (className) {
                                this.$self.closest(className)[state === "active" ? "addClass" : "removeClass"](this.CLASS.activeParent);
                            }.bind(this));
                        });
                    }

                }

                if (this.isEmpty) {

                    this.isEmpty();
                }
            }
        },

        addEmptyStateToParent: function (state) {

            if (this.$self && this.stateToParent) {

                this.stateToParent.split(",").forEach(function (className) {
                    this.$self.closest(className)[state ? "addClass" : "removeClass"](this.CLASS.emptyParent);
                }.bind(this));
            }
        },

        initDragDropUpload: function () {

            Dropzone.autoDiscover = false;

            var options = this.OPTIONS.DROPZONE.call(this);

            //element pro uložení náhledů (nelze v Dropzone zrušit)
            this.$dropzonePreview = $("<div/>");
            options.previewsContainer = this.$dropzonePreview[0];

            options.addedfile = this.superHandleAddedfile.bind(this);

            if (this.handleResize) {

                options.resize = this.handleResize.bind(this);
            }

            options.uploadprogress = this.superHandleUploadProgress.bind(this);
            options.thumbnail = this.superHandleThumbnail.bind(this);
            options.successmultiple = this.superHandleUploadSuccessmultiple.bind(this);
            options.success = this.superHandleUploadSuccess.bind(this);
            options.error = this.superHandleUploadError.bind(this);
            options.complete = this.superHandleUploadComplete.bind(this);

            if (this.onInitDragDropUpload) {

                this.onInitDragDropUpload(options);
            }

            this.dropzone = this.$self.dropzone(options);

            this.dropzoneInstance = Dropzone.forElement(this.self);

            this.uploadFilesLoaded = true;

            this.dropzone.on("dragenter", function (event) {

                if (!event.originalEvent.dataTransfer.types[0] ||
                    !event.originalEvent.dataTransfer.types[0].match(/file/i)) {

                    this.self.classList.add(this.CLASS.notFileDragged);

                    return;
                }

                this.self.classList.remove(this.CLASS.notFileDragged);

            }.bind(this));
        },

        //spustí zobrazování ui při najetí myší
        initOutline: function () {

            this.outlineElement = this.find("." + this.CLASS.outline);

            this.$self
                //pokud uživatel přestane editovat text, je nutné zjistit, jestli má outline zmizet
                .on("focusout." + this.EVENT_NS, function () {

                    if (this.removing) {

                        return;
                    }

                    this.set("hover", false);

                    this.set("focus", false);

                    this.fire("stateChange", this.get("showOutline"));

                    clearTimeout(this.focusoutTimeout);

                    this.focusoutTimeout = setTimeout(this.updateOutlineState.bind(this), 100);

                }.bind(this))
                //zobrazit outline např při tabu nebo označení
                .on("focusin." + this.EVENT_NS, function () {

                    if (this.removing) {

                        return;
                    }

                    //pouze nejvnitřnější elmenet
                    var children = this.findAllComponents(),

                        i = children.length - 1;

                    for (i; i >= 0; i--) {

                        if (children[i].PAGE_ELEMENT && children[i].focusin) {

                            return;
                        }
                    }

                    this.set("hover", true);

                    this.set("focus", true);

                    this.focusin = true;

                    this.fire("stateChange", this.get("showOutline"));

                }.bind(this));

            //při najetí myší zbrazit outline
            this.hoverObserver = this.observe("hover", function (state) {

                if (this.removing) {

                    return;
                }

                if (!hoverByTouch) {

                    //pro případné odstranění vnějších hover stavů
                    this.fire("pageElementHover", state);
                }

                this.updateOutlineState();

                if (!state) {

                    this.focusin = false;

                    this.set("focus", false);

                    this.set("restoreHover", false);

                    if (hoverByTouch) {

                        Ractive.$win.off("touchstart.hover-" + this.EVENT_NS);
                    }
                }
            }, {init: false});

            //při najetí na vnitřní outline je potřeba ostatní odstranit
            this.on("*.pageElementHover", function (state) {

                if (this.removing) {

                    return;
                }

                if (state) {

                    this.set("hover", false);

                    this.fire("stateChange", this.get("showOutline"));

                    //je potřeba uložit stav - až uživatel odjede z vnitřního elementu, outline se vrátí
                    this.set("restoreHover", true);

                } else {

                    if (!this.hasChildPageElementHoverState()) {

                        var restore = this.get("restoreHover");

                        this.set("hover", restore);

                        this.fire("stateChange", this.get("showOutline"));

                    }
                }
            });
        },

        superOncomplete: function () {

            if (Ractive.EDIT_MODE && on.client) {

                this.set("stopTransition", false);
            }
        },

        superOnteardown: function () {

            this.torndown = true;

            if (this.dropzone) {

                this.dropzone.off("*");

                this.dropzoneInstance.removeAllFiles(true);
                this.dropzoneInstance.destroy();

                this.$dropzonePreview.remove();
                this.$dropzonePreview = null;
            }

            clearTimeout(this.hideEditUITimeout);
            clearTimeout(this.focusoutTimeout);

            this.$self.off("." + this.EVENT_NS);

            EventEmitter.off("." + this.EVENT_NS);

            Ractive.$win
                .off("touchstart.hover-" + this.EVENT_NS)
                .off("touchstart.PageElement");
        },

        handleTouchstart: function (event) {

            throttleHoverByTouch();

            if (event.original.touches.length > 1 || this.get("hover")) {

                return;
            }

            this.touchstartTime = +new Date();
            this.cancelTouchend = false;

            var initX = event.original.changedTouches[0].pageX,
                initY = event.original.changedTouches[0].pageY;

            Ractive.$win
                .off("touchstart.hover-" + this.EVENT_NS)
                .on( "touchmove.hover-" + this.EVENT_NS, function (event) {

                    this.cancelTouchend = Math.abs(initX - event.originalEvent.changedTouches[0].pageX) > 5 ||
                        Math.abs(initY - event.originalEvent.changedTouches[0].pageY) > 5;

                }.bind(this))
                .on( "touchstart.hover-" + this.EVENT_NS, function (event) {

                    throttleHoverByTouch();

                    this.hideOutlineTouches = event.originalEvent.changedTouches.length;

                    clearTimeout(this.hideOutlineTimeout);

                    this.hideOutlineTimeout = setTimeout(function() {

                        if (this.hideOutlineTouches > 1) {

                            return;
                        }

                        this.$temp[0] = event.target;

                        //uživatel tapnul na jiný vnitřní/vnější element (nebo úplně jinam)
                        if (this.$temp.closest("." + this.CLASS.self)[0] !== this.self) {

                            this.set("hover", false);

                            this.fire("stateChange", this.get("showOutline"));

                            Ractive.$win.off("touchstart.hover-" + this.EVENT_NS);
                        }

                    }.bind(this), 50);

                }.bind(this));
        },

        handleTouchend: function (event) {

            throttleHoverByTouch();

            Ractive.$win
                .off("touchmove.hover-" + this.EVENT_NS);

            if (this.cancelTouchend || !this.touchstartTime || event.original.touches.length > 1 || this.get("hover")) {

                return;
            }

            this.set("hover", true);

            this.fire("stateChange", this.get("showOutline"));

            var touchendTime = +new Date();

            //pokud uživatel drží prst na elmentu méně než 500ms, needitovat text - pouze zobrazit ui
            if (touchendTime - this.touchstartTime < 500) {

                event.original.preventDefault();
            }

            this.touchstartTime = 0;
        },

        handleHover: function (event) {

            if (hoverByTouch || this.removing) {

                return;
            }

            setMouseTouchStyles(true);

            this.set("hover", event.hover);
        },

        //zobrazí ui, pokud je stav "hover" nebo je otevřeno nastavení nebo má Editor focus,
        //jinak ui skryje
        updateOutlineState: function (forceState) {

            var state = typeof forceState === "boolean" ? forceState : (this.get("hover") || this.get("sorting") || this.get("openPageElementSettings") || this.hasFocusedEditor() || this.hasFocusedElement());

            this.set("showOutline", state);

            this.checkOutlineSize(state);

            this.fire("sectionHasOutline", state);

            this.fire("stateChange", !!state);
        },

        hasFocusedEditor: function () {

            if (this.hasEditor === false) {

                return false;
            }

            var editors = this.findAll("[data-medium-focused='true']"),
                e = editors.length - 1;

            for (e; e >= 0; e--) {

                this.$temp[0] = editors[e];

                if (this.$temp.closest("." + this.CLASS.self)[0] === this.self) {

                    return true;
                }
            }

            return false;
        },

        hasFocusedElement: function () {

            return this.$self.find(":focus").closest("." + this.CLASS.self)[0] === this.self;
        },

        hasChildPageElementHoverState: function () {

            var components = this.findAllComponents(),
                c = components.length - 1;

            for (c; c >= 0; c--) {

                if (components[c].PAGE_ELEMENT && components[c].get("hover")) {

                    return true;
                }
            }

            return false;
        },

        togglePageElementSettings: function (state) {

            this.set("openPageElementSettings", state);

            this.updateOutlineState();
        },

        //pokud outline přesahuje velikost okna, je ptřeba ho změnšit
        checkOutlineSize: function (state) {

            if (!state) {

                this.set("limitSize", false);
            }

            var rect = this.outlineElement.getBoundingClientRect(),

                viewportWidth = U.viewportWidth();


            if (rect.left < 0 || rect.right > viewportWidth) {

                this.set("limitSize", true);
            }
        },

        superHandleAddedfile : function () {

            if (!this.handleAddedfile || this.handleAddedfile.apply(this, arguments) !== false) {

                this.set("pulseOutline", true);
            }
        },

        superHandleThumbnail : function (file) {

            if (!this.handleThumbnail || this.handleThumbnail.apply(this, arguments) !== false) {

                if (file.uploaded) {

                    return;
                }

                this.fire("pageSectionMessage", {
                    title: "Nahrát soubor",
                    text: "Počkejte prosím...",
                    status: "info",
                    timeout: 3000
                });
            }
        },

        superHandleUploadProgress : function (file, progress) {

            if (!this.handleUploadProgress || this.handleUploadProgress.apply(this, arguments) !== false) {

                if (this.torndown) {

                    return;
                }

                this.fire("progressBarProgress", {
                    id: file.name.replace(".", "_"),
                    progress: progress
                });

                this.fire("pageSectionMessage", {
                    title: "Soubor se nahrává...",
                    text: progress.toFixed() + " %",
                    status: "info"
                });
            }
        },

        superHandleUploadSuccessmultiple : function () {

            if (!this.handleUploadSuccessmultiple || this.handleUploadSuccessmultiple.apply(this, arguments) !== false) {

                this.set("pulseOutline", false);
            }
        },

        superHandleUploadSuccess : function (file, res) {

            if (!this.handleUploadSuccess || this.handleUploadSuccess.apply(this, arguments) !== false) {

                file.uploaded = true;

                this.set("data.src", res.path);

                this.fire("pageSectionMessage", {
                    title: "Nahrát soubor",
                    text: "Soubor " + file.name + " se podařilo úspěšně nahrát.",
                    timeout: 3000,
                    status: "success"
                });

                this.set("pulseOutline", false);
            }
        },

        superHandleUploadError: function (file, error) {

            if (!this.handleUploadError || this.handleUploadError.apply(this, arguments) !== false) {

                var errorText = error === "MAX_STORAGE" ? "Soubor " + file.name + " se nepodařilo nahrát. Váš prostor pro data je plný." : error;

                this.fire("progressBarError", {
                    id: file.name.replace(".", "_")
                });

                this.fire("pageSectionMessage", {
                    title: "Nahrát soubor",
                    text: errorText,
                    timeout: 5000,
                    status: "error"
                });

                this.set("pulseOutline", false);
            }
        },

        superHandleUploadComplete: function () {

            if (!this.handleUploadComplete || this.handleUploadComplete.apply(this, arguments) !== false) {

            }
        },

        hideEditUI: function () {

            if (Ractive.EDIT_MODE) {

                clearTimeout(this.hideEditUITimeout);

                this.set("hideEditUI", true);

                this.hideEditUITimeout = setTimeout(this.set.bind(this, "hideEditUI", false), 1000);
            }
        }

    });

}));

