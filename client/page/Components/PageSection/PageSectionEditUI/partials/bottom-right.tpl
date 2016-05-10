{{> FlatButton {
        text: "Barvy",
        icon: "#icon-paint-bucket",
        title: "Nastavení barev sekce",
        fire: "openPageSectionSettings",
        event: "colors",
        state: @ractive.parent.get("openPageSectionSettings") === "colors" ? "active" : ""
    }
}}

{{> FlatButton {
        text: "Pozadí",
        icon: "#icon-picture",
        iconY: 1,
        title: "Nastavení pozadí sekce",
        fire: "openPageSectionSettings",
        event: "background",
        state: @ractive.parent.get("openPageSectionSettings") === "background" ? "active" : ""
    }
}}
