<BackgroundImage data="{{.section.backgroundImage}}" />

<div class="P_PageSection--center">

    <div class="P_PageSection--content-wrapper
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

        {{> PageSectionTitles}}

        <div class="P_PageSectionEmail--form">

            <PageElementEmail
                element="{{.section.input}}"
                button="{{~/section.button}}"
                lang="{{~/lang}}"
                tplLang="{{~/tplLang}}"
                buttonColor="{{~/section.specialColor}}"
                defaultColors="{{~/section.defaultColors}}"
            />

        </div>

    </div>
</div>
