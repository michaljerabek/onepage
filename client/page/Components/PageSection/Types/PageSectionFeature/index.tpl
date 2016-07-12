<BackgroundImage data="{{.section.backgroundImage}}" />

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
            {{#if !-section.buttons.length}}
                has-no-button
            {{/if}}
            {{#if ~/textsActive}}has-active-texts{{/if}}
            {{#if ~/contentActive}}has-active-content{{/if}}
        "
    >

        {{#if (.section.layout || "").match(/^right|^bottom/)}}

        <div class="P_PageSectionFeature--image">
            <img src="http://lorempixel.com/240/240/abstract/10/" alt="">
        </div>

        <div class="P_PageSectionFeature--text">

            <div class="P_PageSectionFeature--title">

                <PageElementText
                    element="{{.section}}"
                    source="title"
                    activateButton="true"
                    lang="{{.lang}}"
                    tplLang="{{.tplLang}}"
                    stateTo=".P_PageSectionFeature--title"
                    maxLength="64"
                    activateIcon="#icon-add-text-1"
                    hasUnderline="true"
                    balanceText="{{(.section.layout || '').match(/^top|^bottom/)}}"
                    editor="title"
                    font="title"
                />

            </div>

            <div class="P_PageSectionFeature--content">

                <PageElementText
                    element="{{.section}}"
                    source="content"
                    activateButton="true"
                    lang="{{.lang}}"
                    tplLang="{{.tplLang}}"
                    stateTo=".P_PageSectionFeature--content"
                    maxLength="1024"
                    activateIcon="#icon-add-text-2"
                    balanceText="{{(.section.layout || '').match(/^top|^bottom/)}}"
                    editor="content"
                    font="body"
                />

            </div>

            {{>PageElementButtons}}

        </div>

        {{else}}

        <div class="P_PageSectionFeature--text">

            <div class="P_PageSectionFeature--title">

                <PageElementText
                    element="{{.section}}"
                    source="title"
                    activateButton="true"
                    lang="{{.lang}}"
                    tplLang="{{.tplLang}}"
                    stateTo=".P_PageSectionFeature--title"
                    maxLength="64"
                    activateIcon="#icon-add-text-1"
                    hasUnderline="true"
                    balanceText="{{(.section.layout || '').match(/^top|^bottom/)}}"
                    editor="title"
                    font="title"
                />

            </div>

            <div class="P_PageSectionFeature--content">

                <PageElementText
                    element="{{.section}}"
                    source="content"
                    activateButton="true"
                    lang="{{.lang}}"
                    tplLang="{{.tplLang}}"
                    stateTo=".P_PageSectionFeature--content"
                    maxLength="1024"
                    activateIcon="#icon-add-text-2"
                    balanceText="{{(.section.layout || '').match(/^top|^bottom/)}}"
                    editor="content"
                    font="body"
                />

            </div>

            {{>PageElementButtons}}

        </div>


        <div class="P_PageSectionFeature--image">
            <img src="http://lorempixel.com/240/240/abstract/10/" alt="">
        </div>

        {{/if}}

    </div>
</div>
