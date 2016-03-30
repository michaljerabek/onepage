<div class="P_PageElement {{#if .type}}P_PageElement__{{.type}}{{/if}}"
     on-hover="handleHover(event)">

    {{#if editMode}}
        <div class="E_PageElement--outline" on-touchend="handleTouchend(event)"></div>
    {{/if}}

    {{#if .hasEditUI}}
        <div class="E_PageElement--EditUI E_PageElementEditUI">
            {{> pageElementEditUI}}
        </div>
    {{/if}}

    {{> pageElementContent}}

</div>
