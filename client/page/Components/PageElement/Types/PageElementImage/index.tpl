<span class="
            P_PageElementImage
        "
    tabindex="{{#if .editMode}}0{{/if}}"
    >
    {{#if .element.src}}
    <span class="P_PageElementImage--image-wrapper"
          intro="{{#if .editMode && @this.Page.get('loaded') && !.stopTransition}}slidevh{{/if}}"
          outro="{{#if .editMode && @this.Page.get('loaded') && !.stopTransition}}slidevh{{/if}}"
    >
        <img class="P_PageElementImage--image" src="{{.element.src}}" alt="{{.element.alt}}">
    </span>
    {{/if}}
</span>
