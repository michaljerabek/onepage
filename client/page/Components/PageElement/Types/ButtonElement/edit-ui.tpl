<div class="E_PageElementEditUI__left">

    {{> FlatButton {
            type: "default-danger",
            size: "small",
            icon: "#icon-trash",
            fire: "removeButton",
            event: .element,
            className: "E_PageElementEditUI--remove",
            title: "Odstranit tlačítko",
            preventDefault: true
        }
    }}

</div>

<div class="E_PageElementEditUI__bottom-left">

    {{> FlatButton {
            size: "small",
            icon: .element.fill ? "#icon-color-stroke" : "#icon-color-fill",
            set: "element.fill",
            value: !.element.fill,
            className: "E_PageElementEditUI--fill",
            title: .element.fill ? "Obrysové tlačítko" : "Vyplněné tlačítko",
            preventDefault: true
        }
    }}

</div>

<div class="E_PageElementEditUI__right">

    {{#if .sortable}}
        {{> FlatButton {
                size: "small",
                icon: "#icon-move",
                className: "E_PageElementEditUI--sort",
                title: "Přesunout tlačítko",
                preventDefault: true,
                mousedown: "sortable",
                touchstart: "sortable",
                state: .sorting ? "active" : ""
            }
        }}
    {{/if}}

    {{> FlatButton {
            size: "small",
            fire: "openPageElementSettings",
            event: "settings",
            icon: "#icon-gear",
            className: "E_PageElementEditUI--settings",
            state: .openPageElementSettings === "settings" ? "active" : "",
            title: "Otevřít nastavení tlačítka",
            preventDefault: true
        }
    }}

</div>

{{#if .openPageElementSettings === "settings"}}
    <ButtonElementSettings
        data="{{.element}}"
        positionElement="{{.pageElementSettingsPositionElement}}"
        lang="{{.lang}}"
        defaultColors="{{.defaultColors}}"
    ></ButtonElementSettings>
{{/if}}

