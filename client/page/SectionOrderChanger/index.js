/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/clearInterval
/*global $*/

var CLASS = require("./../../CLASSNAMES");

module.exports = (function () {

    var OPTIONS = {
            DRAGGED_SECTION_HEIGHT: 40
        },
        
        page,
        $sortable,
        
        $placeholder = $("<div></div>"),

        getSectionsSortedByIndex = function () {

            var pageSections = page.findAllPageSections(),

                sections = [],
                s = pageSections.length - 1;

            for (s; s >= 0; s--) {

                sections[pageSections[s].getCurrentIndex()] = pageSections[s].get("section");
            }

            return sections;
        },
        
        onSortableActivate = function (e, ui) {
            
            var sectionHeight = ui.item[0].getBoundingClientRect().height;

            $placeholder.css({
                height: sectionHeight - OPTIONS.DRAGGED_SECTION_HEIGHT
            });

            ui.item
            .data("height", sectionHeight)
            .css({
                position: "absolute",
                height: sectionHeight
            })
            .addClass(CLASS.PageSection.draggedSection)
            .after($placeholder);
        },
        
        onSortableStart = function (e, ui) {
            
            ui.item.css({
                height: OPTIONS.DRAGGED_SECTION_HEIGHT
            });
            
            $placeholder.css({
                height: 0
            });
        },
        
        onSortableChange = function () {
            
        },
        
        onSortableStop = function (e, ui) {

            $placeholder.css({
                height: 40,
                transition: "none"
            });
            
            setTimeout(function() {
                
                setTimeout(function() {
                    $placeholder.css({
                        transition: ""
                    });
                }, 0);
                
                $placeholder.css({
                    height: 0
                });
                
                ui.item.one("transitionend", function () {
                    ui.item
                        .css("height", "")
                        .removeClass(CLASS.PageSection.placedSection);
                })
                .css({
                    position: "relative",
                    height: ui.item.data("height")
                })
                .addClass(CLASS.PageSection.placedSection)
                .removeClass(CLASS.PageSection.draggedSection);
            }, 0);
        };

    return function (pageComponent) {

        page = pageComponent;

        $placeholder.addClass(CLASS.PageSection.placeholder);
        
        $sortable = $("." + CLASS.PageSection.parentOfSortable).sortable({
            items: "." + CLASS.PageSection.section,
            onlyYDir: true,
            fixedX: true,
            handle: "." + CLASS.PageSection.sortHandle
        });

        $sortable
            .on("sortable:activate", onSortableActivate)
            .on("sortable:start", onSortableStart)
            .on("sortable:change", onSortableChange)
            .on("sortable:stop", onSortableStop);
        
        return {
            getSectionsSortedByIndex: getSectionsSortedByIndex
        };
    };

}());
