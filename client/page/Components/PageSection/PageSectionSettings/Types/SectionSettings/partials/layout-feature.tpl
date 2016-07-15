
{{> Switch {
        size: (~/windowWidth || @global.innerWidth) > 767 ? "large" : "small",
        value: "layout.main",
        options: [
            {
                text: "Text vlevo",
                icon: .layout.text === "top" ? "#icon-feature-left-top" : .layout.text === "bottom" ? "#icon-feature-left-bottom" : "#icon-feature-left-center",
                value: "left"
            },
            {
                text: "Text vpravo",
                icon: .layout.text === "top" ? "#icon-feature-right-top" : .layout.text === "bottom" ? "#icon-feature-right-bottom" : "#icon-feature-right-center",
                value: "right"
            },
            {
                text: "Text nahoře",
                icon: "#icon-feature-top",
                value: "top"
            },
            {
                text: "Text dole",
                icon: "#icon-feature-bottom",
                value: "bottom"
            }
        ]
    }
}}

<div class="E_SectionSettings--layout-div"></div>

{{> Switch {
        size: (~/windowWidth || @global.innerWidth) > 767 ? "large" : "small",
        value: "layout.text",
        options: [
            {
                text: "Nahoře",
                icon: .layout.main === "left" ? "#icon-feature-left-top" : "#icon-feature-right-top",
                value: "top",
                state: .layout.main === "top" || .layout.main === "bottom" ? "disabled" : ""
            },
            {
                text: "Uprostřed",
                icon: .layout.main === "left" ? "#icon-feature-left-center" : "#icon-feature-right-center",
                value: "center",
                state: .layout.main === "top" || .layout.main === "bottom" ? "disabled" : ""
            },
            {
                text: "Dole",
                icon: .layout.main === "left" ? "#icon-feature-left-bottom" : "#icon-feature-right-bottom",
                value: "bottom",
                state: .layout.main === "top" || .layout.main === "bottom" ? "disabled" : ""
            }
        ]
    }
}}

{{#if .layout.main === "left" || .layout.main === "right" }}
    <p slide-in="{duration: .completed ? 300 : 0}" slide-out="{duration: .completed ? 300 : 0}" class="E_PageSectionSettings--section-note">Na mobilních zařízeních bude obrázek {{.layout.main === "right" ? 'nad' : 'pod'}} textem uprostřed.</p>
{{/if}}
