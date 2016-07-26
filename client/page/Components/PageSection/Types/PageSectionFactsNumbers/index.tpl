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
            {{#if !.section.items.length}}
                has-no-items
            {{/if}}
            {{#if .editMode}}
                {{#if ~/titlesActive}}has-active-titles{{/if}}
                {{#if ~/titleActive}}has-active-title{{/if}}
                {{#if ~/subtitleActive}}has-active-subtitle{{/if}}
            {{/if}}
        "
    >

        {{> PageSectionTitles}}

        <div class="P_PageSectionFactsNumbers--items
                {{#if !~/section.items.length}}P_PageSectionFactsNumbers--items__empty{{/if}}
                P_PageSectionFactsNumbers--items__{{~/section.items.length}}
            "
        >

            {{#if ~/editMode && ~/showAddItem && ~/pageElementSettings !== "icons"}}
            <div class="E_PageSection--add-button
                        E_PageSectionFactsNumbers--add-item
                        {{#if ~/addItemBottom}}E_PageSectionFactsNumbers--add-item__bottom{{/if}}
                        "
                 on-tap="@this.fire('addItem')"
                 attr-out="{duration: 300}"
                 attr-in="{duration: 300}"
                 >
                <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{#if ~/section.items.length}}#icon-plus{{else}}#icon-add-button{{/if}}"></use></svg>
            </div>
            {{/if}}

            <div class="P_PageSectionFactsNumbers--items-wrapper" as-Sortable="'section.items','PageElementFact','fact'">

                {{#each ~/section.items}}

                <PageElementFact
                    element="{{this}}"
                    sortable="{{~/section.items.length > 1}}"
                    delatable="{{~/section.items.length > 1}}"
                    factColor="{{~/section.specialColor}}"
                    textColor="{{~/section.textColor}}"
                    defaultColors="{{~/section.defaultColors}}"
                    lang="{{~/lang}}"
                    tplLang="{{~/tplLang}}"
                    mode="number"
                />

                {{/each}}

            </div>

        </div>

    </div>
</div>
