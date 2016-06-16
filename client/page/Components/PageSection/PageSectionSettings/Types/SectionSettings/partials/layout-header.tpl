{{> Switch {
        size: "large",
        value: "data.layout",
        options: [
            {
                text: "Uprostřed",
                icon: "#icon-header-center",
                value: "center"
            },
            {
                text: "Vlevo",
                icon: "#icon-header-left",
                value: "left"
            }
        ]
    }
}}

{{#if .data.layout === "left"}}
    <p intro-outro="{{#if .completed}}slide{{/if}}" class="E_PageSectionSettings--section-note">Na mobilních zařízeních bude obsah zarovnán doprostřed.</p>
{{/if}}
