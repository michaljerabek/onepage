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

        <div class="P_PageSectionClaim--title">

            <PageElementText
                element="{{.section}}"
                source="title"
                activateButton="true"
                lang="{{.lang}}"
                tplLang="{{.tplLang}}"
                stateTo=".P_PageSectionClaim--title"
                countLines="true"
                maxLength="56"
                activateIcon="#icon-add-text-1"
                hasUnderline="true"
                balanceText="true"
                editor="title"
                font="body"
            />

        </div>

        <div class="P_PageSectionClaim--subtitle">

            <PageElementText
                element="{{.section}}"
                source="subtitle"
                activateButton="true"
                lang="{{.lang}}"
                tplLang="{{.tplLang}}"
                stateTo=".P_PageSectionClaim--subtitle"
                maxLength="128"
                activateIcon="#icon-add-text-2"
                hasUnderline="true"
                balanceText="true"
                editor="title"
                font="body"
            />

        </div>

        {{>PageElementButtons}}

    </div>
</div>
