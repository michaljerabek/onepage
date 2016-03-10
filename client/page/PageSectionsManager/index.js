/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/clearInterval
/*global $, requestAnimationFrame*/

var CLASS = require("./../CLASSNAMES");
var SUPPORT = require("./../../SUPPORT");

module.exports = (function () {

    var OPTIONS = {
            DRAGGED_SECTION_HEIGHT: 40,
            SECTION_SPEED: "0.35s",
            SECTION_SPEED_JQ: 350,
            SECTION_EASING: "ease-out",
            SECTION_EASING_JQ: "easeOutSine"
        },

        page,
        pageSectionBuilder,

        $scrollWin,
        $body,

        $sortable,
        $draggable,
        $droppable,

        $placeholder,
        $placeholderTransitions = $("<div></div>"),

        getSectionsSortedByIndex = function () {

            var pageSections = page.findAllPageSections(),

                sections = [],
                pageSectionHeader = null,
                pageSectionFooter = null,

                s = pageSections.length - 1;

            for (s; s >= 0; s--) {

                if (pageSections[s].get("section.type") === "PageSectionHeader") {

                    pageSectionHeader = pageSections[s].get("section");

                } else if (pageSections[s].get("section.type") === "PageSectionFooter") {

                    pageSectionFooter = pageSections[s].get("section");

                } else {

                    sections[pageSections[s].getCurrentIndex()] = pageSections[s].get("section");
                }
            }

            if (pageSectionHeader) {

                sections.unshift(pageSectionHeader);
            }

            if (pageSectionFooter) {

                sections.push(pageSectionFooter);
            }

            //odstranit null (kvůli placeholderu indexy mohou obsahovat mezeru)
            var s2 = sections.length - 1;

            for (s2; s2 >= 0; s2--) {

                if (!sections[s2]) {

                    sections.splice(s2, 1);
                }
            }

            return sections;
        },

        insertSection = function (type, rewriteData, customAnimationProvided) {

            var data = pageSectionBuilder.create(type, rewriteData);

            page.push("page.sections", data);

            var pageSection = page.findAllPageSections().pop();

            if (!customAnimationProvided) {

                var $pageSection = $(pageSection.getSectionElement());

                $scrollWin.stop().animate({
                    scrollTop: $pageSection.offset().top
                }, OPTIONS.SECTION_SPEED_JQ, OPTIONS.SECTION_EASING_JQ);

                $pageSection
                    .hide()
                    .addClass(CLASS.PageSection.placedSection)
                    .css({
                        transition: "none"
                    })
                    .slideDown(OPTIONS.SECTION_SPEED_JQ, OPTIONS.SECTION_EASING_JQ, function () {

                        $pageSection.removeClass(CLASS.PageSection.placedSection);

                        //spoždění zapnutí transition kvůli iOS
                        requestAnimationFrame(function () {

                            $pageSection.css({
                                transition: ""
                            });
                        });
                    });
            }

            page.fire("sectionInserted", pageSection);

            pageSection.once("complete", function () {

                page.fire("sectionInserted.complete", pageSection);
            });

            return pageSection;
        },

        removeSection = function (e) {

            var $sectionElement = $(e.component.getSectionElement());

            $sectionElement
                .addClass(CLASS.PageSection.removedSection)
                .slideUp(OPTIONS.SECTION_SPEED_JQ, OPTIONS.SECTION_EASING_JQ, function () {

                    var sections = page.findAllPageSections(),
                        s = sections.length - 1;

                    for (s; s >= 0; s--) {

                        if (sections[s] === e.component) {

                            page.splice("page.sections", s, 1);

                            break;
                        }
                    }
                });
        },

        onSortableActivate = function (e, ui) {

            if (ui.item.hasClass(CLASS.NewPageSectionSelector.sectionType)) {

                return;
            }

            var sectionHeight = ui.item[0].getBoundingClientRect().height;

            //Placeholder pro transitions se nastaví na velikost sekce mínus velikost velikost
            //"umisťovacího" placeholderu (velikost sekce při přetahování)
            $placeholderTransitions.css({
                height: sectionHeight - OPTIONS.DRAGGED_SECTION_HEIGHT
            });

            ui.item
                .data("height", sectionHeight)
                .css({
                    position: "absolute",

                    height: sectionHeight,

                    //vypnutí transition kvůli iOS
                    transition: "none"
                })
                .addClass(CLASS.PageSection.draggedSection)
                .after($placeholderTransitions);

        },

        onSortableStart = function (e, ui) {

            if (ui.item.hasClass(CLASS.NewPageSectionSelector.sectionType)) {

                return;
            }

            //Sekce se zmenší
            ui.item.css({
                height: OPTIONS.DRAGGED_SECTION_HEIGHT,

                //opětovné zapnutí transition kvůli iOS
                transition: ""
            });

            //Placeholder pro transitions se zmenší na nulu, aby zůstal vidět jen přeřazovací
            $placeholderTransitions.css({
                height: 0
            });

            $placeholder = $placeholder && $placeholder.length ? $placeholder : $sortable.find("." + CLASS.PageSection.placeholder);
        },

        onSortableChange = function (e, ui) {

            $placeholder = $placeholder && $placeholder.length ? $placeholder : $sortable.find("." + CLASS.PageSection.placeholder);

            //označení, že sekce se nachází uvnit stránky - důležité pro přidávání nových sekcí,
            //aby se zjistilo, jestli je sekce ve stránce nebo ve výběru sekcí (pro odsranění)
            ui.item.data("inSortable.PageSectionsManager", true);

            if (ui.item.hasClass(CLASS.NewPageSectionSelector.sectionType) && !ui.item.hasClass(CLASS.NewPageSectionSelector.inserted)) {

                ui.item.addClass(CLASS.NewPageSectionSelector.inserted);

                //zvětšení placeholdru, když uživatel přetáhne poprvé novou sekce do stránky
                $placeholder.css({
                    height: 0,

                    transition: "none"
                });

                $placeholderTransitions.css({
                    height: 0,

                    transition: "none"
                });

                requestAnimationFrame(function() {

                    $placeholder.css({
                        height: OPTIONS.DRAGGED_SECTION_HEIGHT,

                        transition: ""
                    });

                    $placeholderTransitions.css({
                        transition: ""
                    });
                });

                return;
            }

            ui.item.data("positionChanged.PageSectionsManager", true);

        },

        onSortableStop = function (e, ui) {

            //Placeholder pro transitions je potřeba vložit za "umisťovací" placehloder,
            //protože ho bude potřeba na chvíli zobrazit při umístění sekce
            if (ui.item.data("positionChanged.PageSectionsManager")) {

                $placeholder.before($placeholderTransitions);

                ui.item.data("positionChanged.PageSectionsManager", false);
            }

            if (ui.item.hasClass(CLASS.NewPageSectionSelector.sectionType)) {

                $("." + CLASS.NewPageSectionSelector.inserted).removeClass(CLASS.NewPageSectionSelector.inserted);

                //klon přetahované sekce
                var $clone = $("." + CLASS.NewPageSectionSelector.clone),

                    //pozice seřazovatelných sekci
                    $itemOffsetParent = ui.item.offsetParent(),
                    itemParentOffset = $itemOffsetParent.offset(),
                    //pozice vložené sekce = zástupce sekce
                    itemOffset = ui.item.offset(),

                    //pozice klonu, na kterou se přesune zástupce sekce kvůli animaci
                    cloneWidth = $clone.outerWidth(),
                    cloneHeight = $clone.outerHeight(),
                    cloneOffset = $clone.offset(),

                    //vygeneruje se nová sekce a vloží se do stránky
                    newPageSection = insertSection(ui.item.data("page-section-type"), {}, true),
                    $newPageSection = $(newPageSection.getSectionElement()),
                    //vnitřní obalovací element sekce
                    $inner = $newPageSection.find("." + CLASS.PageSection.innerWrapper);

                //sekce se přesune na místo zástupce
                ui.item.after($newPageSection);

                var newSectionHeight = $newPageSection.outerHeight(),
                    newSectionWidth = $newPageSection.outerWidth();

                //zafixují se rozměry vnitřního obalovacího elementu a element se přesune ke kraji stránky
                $inner.css({
                    width: $inner.outerWidth(),

                    transform: "translate(" + ((cloneOffset.left - itemOffset.left) * -1) + "px, 0px)",

                    transition: "none"
                });

                $newPageSection
                    .addClass(CLASS.PageSection.placedSection)
                    .css({
                        //zástupce, podle kterého se nastaví i velikost sekce, je větší než DRAGGED_SECTION_HEIGHT,
                        //proto je potřeba použit negativní margin, aby následující sekce neskočily dolů.
                        marginBottom: -cloneHeight + OPTIONS.DRAGGED_SECTION_HEIGHT,

                        height: cloneHeight,
                        width: cloneWidth,

                        //přesunutí na místo klonu zástupce
                        transform: "translate(" + (cloneOffset.left - itemOffset.left) + "px, " + (cloneOffset.top - itemOffset.top) + "px)",

                        transition: "none"
                    });

                //zástupce se přesune na místo klonu
                ui.item.css({
                    zIndex: 110,
                    position: "absolute",
                    top: -itemParentOffset.top,
                    left: -itemParentOffset.left,

                    height: cloneHeight,
                    width: cloneWidth,

                    opacity: 1,

                    transform: "translate(" + cloneOffset.left + "px, " + cloneOffset.top + "px)",

                    transition: "none"
                });

                //spuštění animace
                //pokud se použije rAF, Webkit dělá chyby
                setTimeout(function() {

                    //zástupce se přesune a zvětší, podle nové sekce
                    ui.item
                        .css({
                            height: newSectionHeight,
                            width: newSectionWidth,

                            opacity: 0,

                            transform: "translate(" + itemOffset.left + "px, " + itemOffset.top + "px)",

                            transition: "all " + OPTIONS.SECTION_SPEED + " " + OPTIONS.SECTION_EASING
                        })
                        .one(SUPPORT.TRANSITIONEND, function () {
                            //zástupce se po provedení animace smaže
                            ui.item.remove();
                        });

                    //vnitřní element se vrátí na nulovou pozici
                    $inner
                        .css({
                            transform: "translate(0px, 0px)",

                            transition: "all " + OPTIONS.SECTION_SPEED + " " + OPTIONS.SECTION_EASING
                        })
                        .one(SUPPORT.TRANSITIONEND, function () {

                            $inner.css({
                                transform: "",

                                transition: ""
                            });
                        });

                    //sekce se roztáhne a přesuna na konečné místo
                    $newPageSection
                        .css({
                            marginBottom: 0,

                            height: newSectionHeight,
                            width: newSectionWidth,

                            transform: "translate(0px, 0px)",

                            transition: "all " + OPTIONS.SECTION_SPEED + " " + OPTIONS.SECTION_EASING
                        })
                        .one(SUPPORT.TRANSITIONEND, function () {

                            $inner.css({
                                width: ""
                            });

                            $newPageSection
                                .removeClass(CLASS.PageSection.placedSection)
                                .css({
                                    marginBottom: "",

                                    width: "",
                                    height: "",

                                    transform: "",

                                    //vypnutí a zapnutí transition kvůli iOS
                                    transition: "none"
                                });

                            //vypnutí a zapnutí transition kvůli iOS
                            requestAnimationFrame(function () {
                                $newPageSection.css({
                                    transition: ""
                                });
                            });
                        });
                }, 0);

                return;
            }

            $placeholder.remove();

            //Zobrazí se placeholder pro transitions, protože umisťovací je odstraněn
            //a sekce se vloží až v následujícím cyklu prohlížeče.
            $placeholderTransitions.css({
                height: OPTIONS.DRAGGED_SECTION_HEIGHT,
                transition: "none"
            });

            requestAnimationFrame(function() {

                //Placeholder pro transitions se zmenší na nulu a vrátí se zpět transition.
                //Protože sekce je již vložena a má velikost jako placeholder.
                requestAnimationFrame(function() {
                    $placeholderTransitions.css({
                        transition: ""
                    });
                });

                $placeholderTransitions
                    .css({
                        height: 0
                    })
                    .one(SUPPORT.TRANSITIONEND, function () {
                        $placeholderTransitions.remove();
                    });

                ui.item
                    .one(SUPPORT.TRANSITIONEND, function () {
                        ui.item
                            //odstraní se přiřazená velikost pro transition
                            .css({
                                height: "",
                                transition: "none"
                            })
                            .removeClass(CLASS.PageSection.placedSection);

                        requestAnimationFrame(function() {
                            ui.item.css({
                               transition: ""
                            });
                        });
                    })
                    .css({
                        position: "relative",
                        //sekce se roztáhne na svou původní velikost
                        height: ui.item.data("height")
                    })
                    .addClass(CLASS.PageSection.placedSection)
                    .removeClass(CLASS.PageSection.draggedSection);
            });
        },

        onDraggableStart = function (e, ui) {

            if (ui.item.hasClass(CLASS.NewPageSectionSelector.sectionType)) {

                //přesunutí klonu do "<body />", protože pozice klonu není přesně na klonovaném elemenu
                //a je posunut daleko od šipky
                var $clone = ui.item.siblings("." + CLASS.NewPageSectionSelector.clone);

                $body.append($clone);

                var offset = ui.item.offset();

                $clone.css({
                    top: offset.top,
                    left: offset.left,
                    transform: "translate(0px, 0px)"
                });
            }
        },

        onDroppableOut = function (e, ui) {

            //zvětší placeholder, když uživatel přetáhne sekci zpět do stránky
            if ($placeholder && !ui.item.data("inSortable.PageSectionsManager")) {

                $placeholder.css({
                    height: 0,

                    display: "block",
                    transition: "none"
                });

                requestAnimationFrame(function () {
                    $placeholder.css({
                        height: OPTIONS.DRAGGED_SECTION_HEIGHT,

                        transition: ""
                    });
                });
            }
        },

        onDroppableOver = function (e, ui) {

            //zmenší placeholder na nulu, když uživatel přetáhne sekci zpět do výběru ("koše")
            if ($placeholder && ui.item.data("inSortable.PageSectionsManager")) {

                $placeholder.css({
                    height: 0,

                    display: "block",
                    transition: ""
                });
            }

            //události "out" a "over" se spouští příliš často -> zajištění, aby se vše provedlo jen jednou
            ui.item.data("inSortable.PageSectionsManager", false);
        },

        onDroppableDrop = function (e, ui) {

            //vytvoření klonu kůvli animaci, protože přetahovaný element zmizí
            var $clone = ui.helper.clone();

            $body.append($clone);

            $clone.fadeOut(OPTIONS.SECTION_SPEED_JQ, function () {
                $clone.remove();
            });

            $placeholderTransitions.remove();

            //zabránění vložení klonu
            e.preventDefault();
        },

        init = function () {

            $droppable = $("." + CLASS.NewPageSectionSelector.self + ", ." + CLASS.PageSection.parentOfNonSortable).droppable({
                accept: ".___XXX",

                alwaysShowPlaceholder: true
            });

            $droppable
                .on("droppable:out", onDroppableOut)
                .on("droppable:over", onDroppableOver)
                .on("droppable:drop", onDroppableDrop);

            $draggable = $("." + CLASS.NewPageSectionSelector.sectionType).draggable({
                connectWith: "." + CLASS.PageSection.parentOfSortable + ", ." + CLASS.NewPageSectionSelector.self + ", ." + CLASS.PageSection.parentOfNonSortable,
                placeholder: CLASS.PageSection.placeholder,
                cloneClass: CLASS.NewPageSectionSelector.clone,

                clone: true,
                onlyYDir: true
            });

            $draggable
                .on("draggable:start", onDraggableStart);

            $sortable = $("." + CLASS.PageSection.parentOfSortable).sortable({
                items: "." + CLASS.PageSection.self,
                handle: "." + CLASS.PageSection.sortHandle,
                placeholder: CLASS.PageSection.placeholder,

                transition: "all " + OPTIONS.SECTION_SPEED + " " + OPTIONS.SECTION_EASING,

                onlyYDir: true,
                fixedX: true
            });

            $sortable
                .on("sortable:activate", onSortableActivate)
                .on("sortable:start", onSortableStart)
                .on("sortable:change", onSortableChange)
                .on("sortable:stop", onSortableStop);

            page.on("PageSection.removeSection", removeSection);
            page.on("NewPageSectionSelector.insertSection", function (event) {
                insertSection(event.node.dataset.pageSectionType);
            });
        },

        destroy = function () {

            if ($sortable) {

                $sortable.sortable("destroy");
            }

            if ($draggable) {

                $draggable.draggable("destroy");
            }

            if ($droppable) {

                $droppable.droppable("destroy");
            }

            $placeholderTransitions.remove();

            page.off("PageSection.removeSection");
            page.off("NewPageSectionSelector.insertSection");
        },

        reset = function () {

            destroy();
            init();
        };

    return function (pageComponent, _pageSectionBuilder, deferInit) {

        page = pageComponent;

        pageSectionBuilder = _pageSectionBuilder;

        $placeholderTransitions.addClass(CLASS.PageSection.placeholderTransitions);

        $body = $("body");
        $scrollWin = $("html, body");

        if (!deferInit) {

            init();
        }

        return {
            insertSection: insertSection,
            removeSection: removeSection,
            getSectionsSortedByIndex: getSectionsSortedByIndex,
            destroy: destroy,
            reset: reset
        };
    };

}());
