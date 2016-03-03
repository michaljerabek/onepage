/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

module.exports = {

    PageSection: {
        self: "P_PageSection",

        innerWrapper: "P_PageSection--inner-wrapper",

        //Seřazování sekcí
        parentOfSortable: "P_sortable-sections",
        parentOfNonSortable: "P_nonsortable-sections",
        sortHandle: "P_PageSection--sort-handle",
        draggedSection: "P_PageSection__dragged",
        placedSection: "P_PageSection__placed",
        removedSection: "P_PageSection__removed",

        placeholderTransitions: "P_PageSection--placeholder__transitions",
        placeholder: "P_PageSection--placeholder"

    },

    PageSectionSettings: {
        self: "E_PageSectionSettings"
    },

    NewPageSectionSelector: {
        self: "E_NewPageSectionSelector",

        sectionType: "E_NewPageSectionSelector--page-section-type",
        clone: "E_NewPageSectionSelector--clone",
        inserted: "E_NewPageSectionSelector__inserted"
    }

};
