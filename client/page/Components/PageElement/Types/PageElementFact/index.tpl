<span class="P_PageElementFact"
    intro="{{#if .editMode && @this.Page.get('loaded') && !.stopTransition}}slide{{/if}}"
    outro="{{#if .editMode && @this.Page.get('loaded') && !.stopTransition}}slide{{/if}}"
>

    {{#if .mode === "icon"}}

    <PageElementIcon
        element="{{.element}}"
        lang="{{.lang}}"
        tplLang="{{.tplLang}}"
        color="{{.factColor}}"
        defaultColors="{{.defaultColors}}"
        activateButton="false"
        defaultIcon="true"
        deletable="false"
    />

    {{/if}}

    {{#if .mode === "number"}}

        <PageElementNumber
            source="number"
            maxLength="5"
            element="{{.element}}"
            lang="{{.lang}}"
            tplLang="{{.tplLang}}"
            color="{{.factColor}}"
            defaultColors="{{.defaultColors}}"
            noModIfEmpty="true"
            defaultValue="1"
            colorType="specialColor"
        />

    {{/if}}

    <PageElementText element="{{.element}}"
        source="text"
        lang="{{.lang}}"
        tplLang="{{.tplLang}}"
        balanceText="false"
        maxLength="24"
        font="title"
        editor="title"
        activateButton="false"
        color="{{.textColor}}"
        defaultColors="{{.defaultColors}}"
        noModIfEmpty="true"
     />

</span>
