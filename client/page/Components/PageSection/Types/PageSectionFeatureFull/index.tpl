
<div class="P_PageSection--center">

    <div class="P_PageSection--content-wrapper
            {{#if ~/textsEmpty || (!.section.title[.lang] && !.section.content[.lang])}}
                has-empty-texts
            {{/if}}
            {{#if ~/titleNotContent || (.section.title[.lang] && !.section.content[.lang])}}
                has-title-not-content
            {{/if}}
            {{#if ~/notTitleContent || (!.section.title[.lang] && .section.content[.lang])}}
                has-content-not-title
            {{/if}}
            {{#if !.section.buttons.length}}
                has-no-button
            {{/if}}
            {{#if .editMode}}
                {{#if ~/imageActive}}has-active-image{{/if}}
                {{#if ~/textsActive}}has-active-texts{{/if}}
                {{#if ~/contentActive}}has-active-content{{/if}}
            {{/if}}
        "
    >

        <div class="P_PageSectionFeatureFull--text">

            <div class="P_PageSectionFeatureFull--title">

                <PageElementText
                    element="{{.section}}"
                    source="title"
                    activateButton="true"
                    lang="{{.lang}}"
                    tplLang="{{.tplLang}}"
                    stateTo=".P_PageSectionFeatureFull--title"
                    maxLength="64"
                    activateIcon="#icon-add-text-1"
                    hasUnderline="true"
                    balanceText="true"
                    editor="title"
                    font="title"
                />

            </div>

            <div class="P_PageSectionFeatureFull--content">

                <PageElementText
                    element="{{.section}}"
                    source="content"
                    activateButton="true"
                    lang="{{.lang}}"
                    tplLang="{{.tplLang}}"
                    stateTo=".P_PageSectionFeatureFull--content"
                    maxLength="320"
                    activateIcon="#icon-add-text-2"
                    balanceText="true"
                    editor="title"
                    font="body"
                />

            </div>

            {{>PageElementButtons}}

        </div>

    </div>
</div>

<BackgroundImage data="{{.section.backgroundImage}}" />
