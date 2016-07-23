<span class="P_PageElementIcon
            P_PageElementIcon__{{.element.setColor || 'fill'}}
        "
    tabindex="{{#if .editMode}}0{{/if}}"
>

    <span class="P_PageElementIcon--icon"
        intro="{{#if .editMode && @this.Page.get('loaded') && !.stopTransition}}slidevh{{/if}}"
        outro="{{#if .editMode && @this.Page.get('loaded') && !.stopTransition}}slidevh{{/if}}"
        style="color: {{.color || .defaultColors.specialColor}}"
    >

        {{#if .element.icon && .element.icon.match(/^ *<svg/i)}}

            {{{.element.icon}}}

        {{elseif .element.icon}}

            <img src="{{.element.icon}}" alt="">

        {{elseif .defaultIcon}}

            {{#if typeof .defaultIcon === "boolean"}}

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1.25 17c0 .69-.559 1.25-1.25 1.25-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25c.691 0 1.25.56 1.25 1.25zm1.393-9.998c-.608-.616-1.515-.955-2.551-.955-2.18 0-3.59 1.55-3.59 3.95h2.011c0-1.486.829-2.013 1.538-2.013.634 0 1.307.421 1.364 1.226.062.847-.39 1.277-.962 1.821-1.412 1.343-1.438 1.993-1.432 3.468h2.005c-.013-.664.03-1.203.935-2.178.677-.73 1.519-1.638 1.536-3.022.011-.924-.284-1.719-.854-2.297z"/>
                </svg>

            {{else}}

                {{{.defaultIcon}}}

            {{/if}}

        {{/if}}

    </span>

</span>
