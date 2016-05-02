{{#if .removeSectionButton !== false}}

    {{> FlatButton {
            type: "default-danger",
            text: ~/removeSectionConfirmation ? "Zrušit" : "Odstranit",
            icon: "#icon-trash",
            title: ~/removeSectionConfirmation ? "Neodstraňovat sekci" : "Odstranit sekci ze stránky",
            set: "removeSectionConfirmation",
            value: ~/removeSectionConfirmation ? false : true,
            className: "P_PageSection--remove" + (~/removeSectionConfirmation ? " P_PageSection--remove__active" : ""),
            state: ~/removeSectionConfirmation ? "active": ""
        }
    }}

<!--
    {{> FlatButton {
            type: "danger",
            className: "P_PageSection--remove__no",
            text: "Ne",
            set: "removeSectionConfirmation",
            value: false
        }
    }}
-->

    {{> FlatButton {
            type: "ok",
            text: "Odstranit",
            icon: "#icon-check-mark",
            title: "Potvrdit odstranění sekce",
            fire: "removeSection",
            className: "P_PageSection--remove__yes"
        }
    }}

{{/if}}
