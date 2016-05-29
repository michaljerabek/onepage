{{> FlatButton {
        text: "Barvy",
        icon: "#icon-paint-bucket",
        title: "Nastavení barev sekce",
        fire: "openPageSectionSettings",
        event: "colors",
        state: @this.parent.get("openPageSectionSettings") === "colors" ? "active" : ""
    }
}}

{{> FlatButton {
        text: "Pozadí",
        icon: "#icon-picture",
        iconY: 1,
        title: "Nastavení pozadí sekce",
        fire: "openPageSectionSettings",
        event: "background",
        state: @this.parent.get("openPageSectionSettings") === "background" ? "active" : ""
    }
}}

{{> FlatButton {
        text: "Nastavení",
        icon: "#icon-gear",
        title: "Obecné nastavení sekce",
        fire: "openPageSectionSettings",
        event: "section",
        state: @this.parent.get("openPageSectionSettings") === "section" ? "active" : ""
    }
}}
