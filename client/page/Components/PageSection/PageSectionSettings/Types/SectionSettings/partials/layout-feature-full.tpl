
{{> Switch {
        size: (~/windowWidth || @global.innerWidth) > 767 ? "large" : "small",
        value: "layout.hor",
        options: [
            {
                text: "Vlevo",
                icon: .layout.ver === "top" ? "#icon-feature-full-left-top" : .layout.ver === "bottom" ? "#icon-feature-full-left-bottom" : "#icon-feature-full-left-center",
                value: "left"
            },
            {
                text: "Uprosřed",
                icon: .layout.ver === "top" ? "#icon-feature-full-center-top" : .layout.ver === "bottom" ? "#icon-feature-full-center-bottom" : "#icon-feature-full-center-center",
                value: "center"
            },
            {
                text: "Vpravo",
                icon: .layout.ver === "top" ? "#icon-feature-full-right-top" : .layout.ver === "bottom" ? "#icon-feature-full-right-bottom" : "#icon-feature-full-right-center",
                value: "right"
            }
        ]
    }
}}

<div class="E_SectionSettings--layout-div"></div>

{{> Switch {
        size: (~/windowWidth || @global.innerWidth) > 767 ? "large" : "small",
        value: "layout.ver",
        options: [
            {
                text: "Nahoře",
                icon: .layout.hor === "left" ? "#icon-feature-full-left-top" : .layout.hor === "right" ? "#icon-feature-full-right-top" : "#icon-feature-full-center-top",
                value: "top",
                state: .layout.hor === "top" || .layout.hor === "bottom" ? "disabled" : ""
            },
            {
                text: "Uprostřed",
                icon: .layout.hor === "left" ? "#icon-feature-full-left-center" : .layout.hor === "right" ? "#icon-feature-full-right-center" : "#icon-feature-full-center-center",
                value: "center",
                state: .layout.hor === "top" || .layout.hor === "bottom" ? "disabled" : ""
            },
            {
                text: "Dole",
                icon: .layout.hor === "left" ? "#icon-feature-full-left-bottom" : .layout.hor === "right" ? "#icon-feature-full-right-bottom" : "#icon-feature-full-center-bottom",
                value: "bottom",
                state: .layout.hor === "top" || .layout.hor === "bottom" ? "disabled" : ""
            }
        ]
    }
}}

{{#if .layout.hor !== "center" || .layout.ver !== "center" }}
    <p slide-in="{duration: .completed ? 300 : 0}" slide-out="{duration: .completed ? 300 : 0}" class="E_PageSectionSettings--section-note">Na mobilních zařízeních bude text {{.layout.ver === "bottom" ? 'pod' : 'nad'}} obrázkem uprostřed.</p>
{{/if}}
