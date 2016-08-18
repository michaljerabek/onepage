<span class="P_PageElementIcon
            P_PageElementIcon__{{.element.setColor || 'fill'}}
        "
    tabindex="{{#if .editMode}}0{{/if}}"
>

    <span class="P_PageElementIcon--icon"
        intro="{{#if ~/editMode && ~/pageLoaded && !.stopTransition}}slidevh{{/if}}"
        outro="{{#if ~/editMode && ~/pageLoaded && !.stopTransition}}slidevh{{/if}}"
        style="color: {{.color || .defaultColors.specialColor}}"
    >

        {{#if .element.icon && .element.icon.match(/^ *<svg/i)}}

            {{{.element.icon}}}

        {{elseif .element.icon}}

            <img src="{{.element.icon}}" alt="">

        {{elseif .defaultIcon}}

            {{#if typeof .defaultIcon === "boolean"}}

                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
                    <path d="M10.068,21.64L21.983,9.724l-0.655-0.702L10.068,20.282l-5.461-5.461L3.928,15.5C3.928,15.5,10.068,21.64,10.068,21.64z"/>
                </svg>

            {{else}}

                {{{.defaultIcon}}}

            {{/if}}

        {{/if}}

    </span>

</span>
