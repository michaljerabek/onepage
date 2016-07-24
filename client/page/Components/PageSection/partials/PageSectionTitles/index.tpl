<div as-PageSectionTitles class="P_PageSectionTitles
        {{#if ~/titlesEmpty || (!.section.title[.lang] && !.section.subtitle[.lang])}}
            has-empty-titles
        {{/if}}
        {{#if ~/titleNotSubtitle || (.section.title[.lang] && !.section.subtitle[.lang])}}
            has-title-not-subtitle
        {{/if}}
        {{#if ~/notTitleSubtitle || (!.section.title[.lang] && .section.subtitle[.lang])}}
            has-subtitle-not-title
        {{/if}}
        {{#if .editMode}}
            {{#if ~/titlesActive}}has-active-titles{{/if}}
            {{#if ~/titleActive}}has-active-title{{/if}}
            {{#if ~/subtitleActive}}has-active-subtitle{{/if}}
        {{/if}}
    "
>

    <div class="P_PageSectionTitles--title">

        <PageElementText
            element="{{.section}}"
            source="title"
            activateButton="true"
            lang="{{.lang}}"
            tplLang="{{.tplLang}}"
            stateTo=".P_PageSectionTitles--title"
            maxLength="80"
            activateIcon="#icon-add-text-1"
            hasUnderline="true"
            balanceText="true"
            editor="title"
            font="title"
        />

    </div>

    <div class="P_PageSectionTitles--subtitle">

        <PageElementText
            element="{{.section}}"
            source="subtitle"
            activateButton="true"
            lang="{{.lang}}"
            tplLang="{{.tplLang}}"
            stateTo=".P_PageSectionTitles--subtitle"
            maxLength="384"
            activateIcon="#icon-add-text-2"
            balanceText="true"
            editor="title"
            font="body"
        />

    </div>

</div>
