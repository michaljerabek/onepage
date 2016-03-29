<div class="P_PageElement {{#if .type}}P_PageElement__{{.type}}{{/if}}">

    {{#if .hasEditUI}}
        <div class="E_PageElement--EditUI E_PageElementEditUI">
            {{> pageElementEditUI}}
        </div>
    {{/if}}

    {{> pageElementContent}}

</div>
