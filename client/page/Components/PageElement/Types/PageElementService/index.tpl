<span class="P_PageElementService P_PageElementService__{{.layout || 'center'}}"
    intro="{{#if .editMode && @this.Page.get('loaded') && !.stopTransition}}slide{{/if}}"
    outro="{{#if .editMode && @this.Page.get('loaded') && !.stopTransition}}slide{{/if}}"
>

    <PageElementIcon
        element="{{.element}}"
        lang="{{.lang}}"
        tplLang="{{.tplLang}}"
        color="{{.iconColor}}"
        defaultColors="{{.defaultColors}}"
        activateButton="false"
        defaultIcon="true"
        deletable="false"
    />

    <PageElementText
        element="{{.element}}"
        source="title"
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
        defaultValue="Vypňte nadpis"
     />

    <PageElementText
        element="{{.element}}"
        source="content"
        lang="{{.lang}}"
        tplLang="{{.tplLang}}"
        balanceText="false"
        maxLength="264"
        font="body"
        editor="title"
        activateButton="false"
        color="{{.textColor}}"
        defaultColors="{{.defaultColors}}"
        noModIfEmpty="true"
        defaultValue="Vyplňte obsah"
    />

</span>
