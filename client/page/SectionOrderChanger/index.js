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

        $sortable,

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

            //Sekce se zmenší
            ui.item.css({
                height: OPTIONS.DRAGGED_SECTION_HEIGHT
            });

            //Placeholder pro transitions se zmenší na nulu, aby zůstal vidět jen přeřazovací
            $placeholderTransitions.css({
                height: 0
            });

            $placeholder = $placeholder && $placeholder.length ? $placeholder : $sortable.find("." + CLASS.PageSection.placeholder);
        },

        onSortableChange = function () {

            //Placeholder pro transitions je potřeba vložit za "umisťovací" placehloder,
            //protože ho bude potřeba na chvíli zobrazit při umístění sekce
            $placeholder.after($placeholderTransitions);
        },

        onSortableStop = function (e, ui) {

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

        init = function () {

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
        },

        reset = function () {

            destroy();
            init();
        };

    return function (pageComponent, deferInit) {

        page = pageComponent;

        $placeholderTransitions.addClass(CLASS.PageSection.placeholderTransitions);

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
