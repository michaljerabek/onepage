<BackgroundImage data="{{.section.backgroundImage}}" />

<div class="P_PageSection--center">

    <div class="P_PageSection--content-wrapper
            {{#if ~/titlesEmpty || (!.section.title[.lang] && !.section.subtitle[.lang])}}
                has-empty-titles
            {{/if}}
            {{#if ~/titleNotSubtitle || (.section.title[.lang] && !.section.subtitle[.lang])}}
                has-title-not-subtitle
            {{/if}}
            {{#if ~/titleActive}}has-active-title{{/if}}
            {{#if ~/subtitleActive}}has-subtitle-active{{/if}}
        "
    >

        <div class="P_PageSectionHeader--title">

            <PageElementText
                element="{{.section}}"
                source="title"
                activateButton="true"
                lang="{{.lang}}"
                tplLang="{{.tplLang}}"
                stateTo=".P_PageSectionHeader--title"
                countLines="true"
                maxLength="74"
                activateIcon="#icon-add-text-1"
                hasUnderline="true"
                balanceText="true"
                editor="title"
                font="title"
            />

        </div>

        <div class="P_PageSectionHeader--subtitle">

            <PageElementText
                element="{{.section}}"
                source="subtitle"
                activateButton="true"
                lang="{{.lang}}"
                tplLang="{{.tplLang}}"
                stateTo=".P_PageSectionHeader--subtitle"
                maxLength="164"
                activateIcon="#icon-add-text-2"
                hasUnderline="true"
                balanceText="true"
                editor="title"
                font="title"
            />

        </div>

        {{>PageElementButtons}}

    </div>
</div>
