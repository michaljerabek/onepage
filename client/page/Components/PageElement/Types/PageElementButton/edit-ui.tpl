<div class="E_PageElementEditUI__left">

    {{#if .deletable !== false}}

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

    {{/if}}

</div>

<div class="E_PageElementEditUI__bottom-left">

    {{> FlatButton {
            type: "default-warn",
            size: "small",
            icon: .element.fill ? "#icon-button-stroke" : "#icon-button-fill",
            set: "element.fill",
            value: !.element.fill,
            className: "E_PageElementEditUI--fill",
            title: .element.fill ? "Obrysové tlačítko" : "Vyplněné tlačítko",
            preventDefault: true
        }
    }}

    {{#if .element.icon}}

        <span slideh-in="{duration: @this.Page.get('loaded') ? 300 : 0}" slideh-out="{duration: @this.Page.get('loaded') ? 300 : 0}">
            {{> FlatButton {
                    size: "small",
                    icon: .element.icon && .element.icon.match(/\#[^\"\']+/)[0],
                    text: "Ikona",
                    set: "element.hideIcon",
                    value: !.element.hideIcon,
                    className: "E_PageElementEditUI--hide-icon",
                    title: .element.hideIcon ? "Zobrazit ikonu" : "Skrýt ikonu",
                    preventDefault: true,
                    state: !.element.hideIcon ? "active" : ""
                }
            }}
        </span>

    {{/if}}

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
    <PageElementButtonSettings
        data="{{.element}}"
        positionElement="{{.pageElementSettingsPositionElement}}"
        lang="{{.lang}}"
        defaultColors="{{.defaultColors}}"
        color="{{.color}}"
        actions="{{.actions}}"
    ></PageElementButtonSettings>
{{/if}}

