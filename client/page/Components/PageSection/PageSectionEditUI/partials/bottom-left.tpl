{{#if .hideEditUIButton !== false}}

    {{> FlatButton {
            type: "default",
            text: "Skrýt panel",
            icon: "#icon-eye",
            iconY: 1,
            title: "Skrýt ovládací prvky sekce",
            touchstart: "preHideEditUI",
            mousedown: "preHideEditUI",
            mouseup: "hideEditUI",
            touchend: "hideEditUI",
            className: "P_PageSection--hide-edit-ui"
        }
    }}
{{/if}}
