<span role="{{#if .element.link}}link{{else}}button{{/if}}"
    data-link="{{.element.link}}"
    data-product="{{.element.product}}"
    class="
        P_ButtonElement
        {{#if .element.fill}}P_ButtonElement__fill{{else}}P_ButtonElement__stroke{{/if}}
        E_Editor__button
    "
    style="color: {{.element.color || .defaultColors.specialColor}}"
    on-tap="@this.action(event, editMode)"
    intro-outro="{{#if .editMode && @this.findParent('Page').get('loaded')}}slideh{{/if}}"
 >
    {{#if .element.icon}}

        {{#if .element.icon.match(/\/svg>/)}}

            <span class="
                    P_ButtonElement--icon P_ButtonElement--icon__svg
                "
                intro-outro="{{#if .editMode && @this.findParent('Page').get('loaded')}}slideh{{/if}}"
            >
                {{{.element.icon}}}
            </span>

        {{else}}

            <span class="
                    P_ButtonElement--icon P_ButtonElement--icon__image
                "
                style="background-image: url('{{.element.icon}}');"
                intro-outro="{{#if .editMode && @this.findParent('Page').get('loaded')}}slideh{{/if}}"
            ></span>

        {{/if}}

    {{/if}}

    <span class="P_ButtonElement--text" contenteditable="{{!!editMode}}" on-blur="@this.removeIfEmpty()" value="{{.element.text[.lang]}}"></span>
 </span>
