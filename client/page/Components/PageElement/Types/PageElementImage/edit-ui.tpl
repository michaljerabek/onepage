{{#if .element.src}}

    <div class="E_PageElementEditUI__left">

        <span slideh-in="{duration: @this.Page.get('loaded') ? 300 : 0}"
              slideh-out="{delay: 300, duration: @this.Page.get('loaded') ? 300 : 0}"
        >

            {{> FlatButton {
                    type: "default-danger",
                    size: "small",
                    icon: "#icon-trash",
                    fire: "removeImage",
                    event: .element,
                    className: "E_PageElementEditUI--remove",
                    title: "Odstranit obrázek",
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
            event: "image",
            icon: "#icon-folder",
            className: "E_PageElementEditUI--folder",
            state: .openPageElementSettings === "image" ? "active" : "",
            title: "Vybrat nebo nahrát obrázek",
            preventDefault: true
        }
    }}

</div>

{{#if .openPageElementSettings === "image"}}

    <PageElementImageBrowser
        data="{{.element}}"
        positionElement="{{.pageElementSettingsPositionElement}}"
        selectedPath="{{.element.src}}"
        settingsTitle="Vybrat obrázek"
        lang="{{.lang}}"
    />

{{/if}}

