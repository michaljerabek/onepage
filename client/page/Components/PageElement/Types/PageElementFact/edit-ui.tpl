{{#if .delatable}}

    <div class="E_PageElementEditUI__left">

        <span slideh-in="{duration: @this.Page.get('loaded') ? 300 : 0}"
              slideh-out="{delay: 0, duration: @this.Page.get('loaded') ? 300 : 0}"
        >

            {{> FlatButton {
                    type: "default-danger",
                    size: "small",
                    icon: "#icon-trash",
                    fire: "removeFact",
                    event: .element,
                    className: "E_PageElementEditUI--remove",
                    title: "Odstranit",
                    preventDefault: true
                }
            }}

        </span>
    </div>
{{/if}}

<div class="E_PageElementEditUI__right">

    {{#if .sortable}}
        {{> FlatButton {
                size: "small",
                icon: "#icon-move",
                className: "E_PageElementEditUI--sort",
                title: "Přesunout položku",
                preventDefault: true,
                mousedown: "sortable",
                touchstart: "sortable",
                state: .sorting ? "active" : ""
            }
        }}
    {{/if}}

</div>

