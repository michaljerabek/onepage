{{#if .element.icon && .deletable !== false}}

    <div class="E_PageElementEditUI__left">

        <span slideh-in="{duration: @this.Page.get('loaded') ? 300 : 0}"
              slideh-out="{delay: 300, duration: @this.Page.get('loaded') ? 300 : 0}"
        >

            {{> FlatButton {
                    type: "default-danger",
                    size: "small",
                    icon: "#icon-trash",
                    fire: "removeIcon",
                    event: .element,
                    className: "E_PageElementEditUI--remove",
                    title: "Odstranit ikonu",
                    preventDefault: true
                }
            }}

        </span>
    </div>
 {{/if}}

<div class="E_PageElementEditUI__right">

    {{> FlatButton {
            size: "small",
            fire: "openPageElementSettings",
            event: "icon",
            icon: "#icon-folder",
            className: "E_PageElementEditUI--folder",
            state: .openPageElementSettings === "icon" ? "active" : "",
            title: "Vybrat nebo nahrát ikonu",
            preventDefault: true
        }
    }}

</div>

<div class="E_PageElementEditUI__bottom-left">

    {{#if .element.icon && .element.icon.match(/^ *<svg/)}}

        <span slideh-in="{duration: @this.Page.get('loaded') ? 300 : 0}"
              slideh-out="{delay: 300, duration: @this.Page.get('loaded') ? 300 : 0}"
        >

            {{> FlatButton {
                    size: "small",
                    set: "element.setColor",
                    value: .element.setColor === "stroke" ? "fill" : .element.setColor === "fill" ? "both" : .element.setColor === "both" ? "none" : "stroke",
                    icon: .element.setColor === "stroke" ? "#icon-fill-stroke-stroke" : .element.setColor === "fill" ? "#icon-fill-stroke-fill" : .element.setColor === "both" ? "#icon-fill-stroke-both" : "#icon-fill-stroke-none",
                    className: "E_PageElementEditUI--setColor",
                    state: "",
                    title: .element.setColor === "stroke" ? "Obarvuje se čára => čára + výplň" : .element.setColor === "both" ? "Obarvuje se čára i výplň => výplň" : .element.setColor === "fill" ? "Obarvuje se výplň => vypnout obarvování" : "Obarvování vypnuto => čára",
                    preventDefault: true
                }
            }}

        </span>
    {{/if}}

</div>

{{#if .openPageElementSettings === "icon"}}

    <PageElementIconBrowser
        data="{{.element}}"
        positionElement="{{.pageElementSettingsPositionElement}}"
        selectedPath="{{.element.icon}}"
        settingsTitle="Vybrat ikonu"
        lang="{{.lang}}"
    />

{{/if}}

