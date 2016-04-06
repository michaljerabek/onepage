<div class="
        P_PageElement
        P_PageElement__[[.type || 'unknown-type']]
    "
    on-hover="handleHover(event)"
>

    {{#if .editMode}}
        <div class="
                E_PageElement--outline
                {{#if .showOutline}}E_PageElement--outline__active{{/if}}
            "
            on-touchstart="handleTouchstart(event)"
            on-touchend="handleTouchend(event)"
        >
        </div>

        {{#if .hasEditUI}}
            <div class="E_PageElement--EditUI E_PageElementEditUI">
                {{> pageElementEditUI}}
            </div>
        {{/if}}
    {{/if}}

    {{> pageElementContent}}

</div>
