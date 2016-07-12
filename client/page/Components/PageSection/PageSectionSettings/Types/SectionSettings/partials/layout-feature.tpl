
{{> Switch {
        size: "large",
        value: "layout.main",
        options: [
            {
                text: "Text vlevo",
                icon: "#icon-header-center",
                value: "left"
            },
            {
                text: "Text vpravo",
                icon: "#icon-header-center",
                value: "right"
            },
            {
                text: "Text nahoře",
                icon: "#icon-header-left",
                value: "top"
            },
            {
                text: "Text dole",
                icon: "#icon-header-left",
                value: "bottom"
            }
        ]
    }
}}

<div class="E_SectionSettings--layout-div"></div>

{{> Switch {
        size: "large",
        value: "layout.text",
        options: [
            {
                text: "Uprostřed",
                icon: "#icon-header-center",
                value: "center",
                state: .layout.main === "top" || .layout.main === "bottom" ? "disabled" : ""
            },
            {
                text: "Nahoře",
                icon: "#icon-header-left",
                value: "top",
                state: .layout.main === "top" || .layout.main === "bottom" ? "disabled" : ""
            },
            {
                text: "Dole",
                icon: "#icon-header-left",
                value: "bottom",
                state: .layout.main === "top" || .layout.main === "bottom" ? "disabled" : ""
            }
        ]
    }
}}

{{#if .layout.main === "left" || .layout.main === "right" }}
    <p slide-in="{duration: .completed ? 300 : 0}" slide-out="{duration: .completed ? 300 : 0}" class="E_PageSectionSettings--section-note">Na mobilních zařízeních bude obsah zarovnán doprostřed.</p>
{{/if}}
