{{#if .sortHandleButton !== false}}

    {{> FlatButton {
            text: "Přesunout",
            title: "Přesunout sekci",
            icon: "#icon-up-down",
            className: "P_PageSection--sort-handle"
        }
    }}

{{/if}}
