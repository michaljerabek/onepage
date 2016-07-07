<div class="E_PageElementEditUI__bottom-left">

    {{> FlatButton {
            state: .restoreFill ? "active" : "",
            type: .restoreFill ? "default-2" : "default-warn",
            size: "small",
            icon: .element.fill && !.restoreFill ? "#icon-button-stroke" : "#icon-button-fill",
            set: .restoreFill ? "" : "element.fill",
            value: !.element.fill,
            className: "E_PageElementEditUI--fill",
            title: .restoreFill ? "Barva na pozadí byla aktivována pouze kvůli nastavení barev. Po zavření nastavení se vrátí původní stav." : .element.fill ? "Průhledné pozadí, pokud je stránka nahoře." : "Vždy zobrazovat barvu pozadí",
            preventDefault: true
        }
    }}

    {{#if .element.fill && !.restoreFill}}

        <span slideh-in="{duration: @this.Page.get('loaded') ? 300 : 0}" slideh-out="{duration: @this.Page.get('loaded') ? 300 : 0}">

            {{> FlatButton {
                    state: .element.shadow ? "active" : "",
                    size: "small",
                    icon: "#icon-box-shadow",
                    set: "element.shadow",
                    value: !.element.shadow,
                    className: "E_PageElementEditUI--shadow",
                    title: "Vždy zobrazovat stín pod menu.",
                    preventDefault: true
                }
            }}
        </span>

    {{/if}}


</div>

<div class="E_PageElementEditUI__right">

    {{> FlatButton {
            size: "small",
            fire: "openPageElementSettings",
            event: "settings",
            icon: "#icon-gear",
            className: "E_PageElementEditUI--settings",
            state: .openPageElementSettings === "settings" ? "active" : "",
            title: "Otevřít nastavení menu",
            preventDefault: true
        }
    }}

</div>

{{#if .openPageElementSettings === "settings"}}

    <PageElementMenuSettings
        data="{{.element}}"
        positionElement="{{.pageElementSettingsPositionElement}}"
        lang="{{.lang}}"
        defaultColors="{{.defaultColors}}"
        backgroundColor="{{.backgroundColor}}"
        textColor="{{.textColor}}"
        sections="{{.sections}}"
        links="{{.links}}"
    ></PageElementMenuSettings>

{{/if}}
