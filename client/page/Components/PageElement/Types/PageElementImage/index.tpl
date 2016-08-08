<span class="P_PageElementImage
        {{#if .useCSS}}P_PageElementImage__CSS{{/if}}
    "
    tabindex="{{#if .editMode}}0{{/if}}"
>
    {{#if .element.src || .defaultImage}}
    <span class="P_PageElementImage--image-wrapper"
        intro="{{#if .editMode && @this.Page.get('loaded') && !.stopTransition}}slidevh{{/if}}"
        outro="{{#if .editMode && @this.Page.get('loaded') && !.stopTransition}}slidevh{{/if}}"
        style="
            {{#if .useCSS}}background-image: url({{.element.src || .defaultImage}}){{/if}};
            -webkit-background-size: {{.element.backgroundSize || .defaultBackgroundSize || 'contain'}};
            -moz-background-size: {{.element.backgroundSize || .defaultBackgroundSize || 'contain'}};
            background-size: {{.element.backgroundSize || .defaultBackgroundSize || 'contain'}};
        "
    >
        <img class="P_PageElementImage--image" src="{{.element.src || .defaultImage}}" alt="{{.element.alt}}">
    </span>
    {{/if}}
</span>
