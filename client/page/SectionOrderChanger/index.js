/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/clearInterval
/*global $*/

var CLASS = require("./../CLASSNAMES");

module.exports = (function () {

    var OPTIONS = {
            DRAGGED_SECTION_HEIGHT: 40,
            PLACED_SECTION_SPEED: "0.35s",
            PLACED_SECTION_EASING: "ease-out"
        },

        page,

        $body,

        $sortable,
        $draggable,

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
                    height: sectionHeight
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
                height: OPTIONS.DRAGGED_SECTION_HEIGHT
            });

            //Placeholder pro transitions se zmenší na nulu, aby zůstal vidět jen přeřazovací
            $placeholderTransitions.css({
                height: 0
            });
        },

        onSortableChange = function (e, ui) {

            $placeholder = $placeholder && $placeholder.length ? $placeholder : $sortable.find("." + CLASS.PageSection.placeholder);

            if (ui.item.hasClass(CLASS.NewPageSectionSelector.sectionType) && !ui.item.hasClass(CLASS.NewPageSectionSelector.inserted)) {

                ui.item.addClass(CLASS.NewPageSectionSelector.inserted);

                $placeholder.css({
                    height: 0,
                    transition: "none"
                });

                $placeholderTransitions.css({
                    height: 0,
                    transition: "none"
                });

                setTimeout(function() {

                    $placeholder.css({
                        height: OPTIONS.DRAGGED_SECTION_HEIGHT,
                        transition: ""
                    });

                    $placeholderTransitions.css({
                        transition: ""
                    });

                }, 0);
            }

            //Placeholder pro transitions je potřeba vložit za "umisťovací" placehloder,
            //protože ho bude potřeba na chvíli zobrazit při umístění sekce
            $placeholder.after($placeholderTransitions);
        },

        onSortableStop = function (e, ui) {

            if (ui.item.hasClass(CLASS.NewPageSectionSelector.sectionType)) {

                ui.item.removeClass(CLASS.NewPageSectionSelector.inserted);

                var $clone = $("." + CLASS.NewPageSectionSelector.clone),

                    itemOffset = ui.item.offset(),

                    cloneWidth = $clone.outerWidth(),
                    cloneHeight = $clone.outerHeight(),
                    cloneOffset = $clone.offset();

                var $newSection = $("<section class='P_PageSection' style='font-size: 22px;padding: 40px 30px; line-height: 1.6'><div class='P_PageSection--inner-wrapper'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe temporibus possimus omnis sint commodi repellendus minima accusamus quas. Dignissimos vel, ipsa eveniet quo. Totam aspernatur quis, incidunt consequuntur provident deserunt officia tempora illum sequi ad ullam quos quas ducimus non, maxime ipsum hic accusamus reprehenderit minima quo rerum distinctio fuga!</div></section>"),
                    $inner = $newSection.find("." + CLASS.PageSection.innerWrapper);

                ui.item.after($newSection);

                var newSectionHeight = $newSection.outerHeight(),
                    newSectionWidth = $newSection.outerWidth();

                $inner.css({
                    width: $inner.outerWidth()
                });

                $newSection
                    .addClass(CLASS.PageSection.placedSection)
                    .css({
                        marginBottom: -cloneHeight + OPTIONS.DRAGGED_SECTION_HEIGHT,

                        height: cloneHeight,
                        width: cloneWidth,

                        transform: "translate(" + (cloneOffset.left - itemOffset.left) + "px, " + (cloneOffset.top - itemOffset.top) + "px)",
                        transition: "none"
                    });

                ui.item.css({
                    zIndex: 110,
                    position: "absolute",
                    top: 0,
                    left: 0,

                    height: cloneHeight,
                    width: cloneWidth,

                    opacity: 1,

                    transform: "translate(" + cloneOffset.left + "px, " + cloneOffset.top + "px)"
                });

                setTimeout(function() {

                    ui.item
                        .css({
                            height: newSectionHeight,
                            width: newSectionWidth,
                            opacity: 0,
                            transform: "translate(" + itemOffset.left + "px, " + itemOffset.top + "px)",
                            transition: "all " + OPTIONS.PLACED_SECTION_SPEED + " " + OPTIONS.PLACED_SECTION_EASING
                        })
                        .one("transitionend", function () {
                            ui.item.remove();
                        });

                    $newSection
                        .css({
                            marginBottom: 0,

                            height: newSectionHeight,
                            width: newSectionWidth,

                            transform: "translate(0px, 0px)",
                            transition: "all " + OPTIONS.PLACED_SECTION_SPEED + " " + OPTIONS.PLACED_SECTION_EASING
                        })
                        .one("transitionend", function () {

                            $inner.css({
                                width: ""
                            });

                            $newSection
                                .removeClass(CLASS.PageSection.placedSection)
                                .css({
                                    marginBottom: "",
                                    width: "",
                                    height: "",
                                    transition: "",
                                    transform: ""
                                });
                        });
                }, 0);

                return;
            }

            //Zobrazí se placeholder pro transitions, protože umisťovací je odstraněn
            //a sekce se vloží až v následujícím cyklu prohlížeče.
            $placeholderTransitions.css({
                height: OPTIONS.DRAGGED_SECTION_HEIGHT,
                transition: "none"
            });

            setTimeout(function() {

                //Placeholder pro transitions se zmenší na nulu a vrátí se zpět transition.
                //Protože sekce je již vložena a má velikost jako placeholder.
                setTimeout(function() {
                    $placeholderTransitions.css({
                        transition: ""
                    });
                }, 0);

                $placeholderTransitions.css({
                    height: 0
                });
                //-----------

                ui.item
                    .one("transitionend", function () {
                        ui.item
                            //odstraní se přiřazená velikost pro transition
                            .css("height", "")
                            .removeClass(CLASS.PageSection.placedSection);
                    })
                    .css({
                        position: "relative",
                        //sekce se roztáhne na svou původní velikost
                        height: ui.item.data("height")
                    })
                    .addClass(CLASS.PageSection.placedSection)
                    .removeClass(CLASS.PageSection.draggedSection);
            }, 0);
        },

        onDraggableStart = function (e, ui) {

            if (ui.item.hasClass(CLASS.NewPageSectionSelector.sectionType)) {

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

        init = function () {

            $draggable = $("." + CLASS.NewPageSectionSelector.sectionType).draggable({
                connectWith: "." + CLASS.PageSection.parentOfSortable,
                placeholder: CLASS.PageSection.placeholder,
                cloneClass: CLASS.NewPageSectionSelector.clone,

                clone: true,

                transition: "all " + OPTIONS.PLACED_SECTION_SPEED + " " + OPTIONS.PLACED_SECTION_EASING,

                onlyYDir: true
            });

            $draggable.on("draggable:start", onDraggableStart);

            $sortable = $("." + CLASS.PageSection.parentOfSortable).sortable({
                items: "." + CLASS.PageSection.self,
                handle: "." + CLASS.PageSection.sortHandle,
                placeholder: CLASS.PageSection.placeholder,

                transition: "all " + OPTIONS.PLACED_SECTION_SPEED + " " + OPTIONS.PLACED_SECTION_EASING,

                onlyYDir: true,
                fixedX: true
            });

            $sortable
                .on("sortable:activate", onSortableActivate)
                .on("sortable:start", onSortableStart)
                .on("sortable:change", onSortableChange)
                .on("sortable:stop", onSortableStop);
        },

        destroy = function () {

            if ($sortable) {

                $sortable.sortable("destroy");
            }

            if ($draggable) {

                $draggable.draggable("destroy");
            }
        },

        reset = function () {

            destroy();
            init();
        };

    return function (pageComponent, deferInit) {

        page = pageComponent;

        $placeholderTransitions.addClass(CLASS.PageSection.placeholderTransitions);

        $body = $("body");

        if (!deferInit) {

            init();
        }

        return {
            getSectionsSortedByIndex: getSectionsSortedByIndex,
            destroy: destroy,
            reset: reset
        };
    };

}());
