{{#if !pageId || pageId === page._id}}

    {{#if .pageIsSaving}}
        <div outro="fade" style="position: fixed; z-index: 99999; top: 0; left: 0; width: 100%; height: 100%; background: black; opacity: 0.75;"></div>
    {{/if}}

    {{#if .editMode}}

        <NewPageSectionSelector />

    {{/if}}

    <div id="page" class="{{#if .editMode}}E{{/if}}">
        <h1 style="float: left">{{page.name}}</h1>

        {{#if .isAdmin}}
            <button style="float: left; margin-top: 30px; margin-left: 10px" on-tap="closePage()">Zavřít</button>
        {{/if}}

        {{#if .editMode}}
            <button style="float: left; margin-top: 30px; margin-left: 10px" on-tap="savePage()">Uložit</button>
        {{/if}}

        <hr style="clear: both">

        <div class="P_nonsortable-sections">

            {{#each page.sections:sectionIndex}}

                {{#if this.type === "PageSectionHeader"}}
                    <PageSection section="{{this}}" sectionIndex="{{sectionIndex}}" />
                {{/if}}

            {{/each}}

        </div>

        <div class="P_sortable-sections">

            {{#each page.sections:sectionIndex}}

                {{#if this.type !== "PageSectionHeader" && this.type !== "PageSectionFooter"}}
                    <PageSection section="{{this}}" sectionIndex="{{sectionIndex}}" />
                {{/if}}

            {{/each}}

        </div>

        <div class="P_nonsortable-sections">

            {{#each page.sections:sectionIndex}}

                {{#if this.type === "PageSectionFooter"}}
                    <PageSection section="{{this}}" sectionIndex="{{sectionIndex}}" />
                {{/if}}

            {{/each}}

        </div>

    </div>
{{/if}}
