{{#if .section.buttons.length || .editMode}}

<div class="
        P_PageSection--buttons
        {{#if !.section.buttons.length}}P_PageSection--buttons__empty{{/if}}
        P_PageSection--buttons__{{.section.buttons.length}}
        cf
    "
    decorator="PageElementButtons"
>

    {{#if .editMode && .showAddButton}}
    <div class="E_PageSection--add-button
            E_PageElementButtons--add-button
            {{#if .addButtonBottom}}E_PageElementButtons--add-button__bottom{{/if}}
        "
        on-tap="@this.fire('addButton')"
        intro-outro="attr:{duration: 300}"
    >
        <svg><use xlink:href="#icon-plus"></use></svg>
    </div>
    {{/if}}

    <div class="P_PageSection--buttons-wrapper" decorator="Sortable:'section.buttons','PageElementButton','button'">

        {{#each .section.buttons}}

        <PageElementButton sortable="{{~/section.buttons.length > 1}}" index="{{@index}}" element="{{.}}" defaultColors="{{~/section.defaultColors}}" lang="{{~/lang}}" tplLang="{{~/tplLang}}" />

        {{/each}}

    </div>

</div>

{{/if}}
