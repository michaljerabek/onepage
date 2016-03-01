/*jslint indent: 4, white: true, nomen: true, regexp: true, unparam: true, node: true, browser: true, devel: true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: true*/

module.exports = {

    PageSection: {
        self: "P_PageSection",

        //Seřazování sekcí
        parentOfSortable: "P_sortable-sections",
        parentOfNonSortable: "P_nonsortable-sections",
        sortHandle: "P_PageSection--sort-handle",
        draggedSection: "P_PageSection--dragged",
        placedSection: "P_PageSection--placed",

        placeholderTransitions: "P_PageSection--placeholder__transitions",
        placeholder: "P_PageSection--placeholder"
    },

    PageSectionSettings: {
        self: "E_PageSectionSettings"
    }

};
