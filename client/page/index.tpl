{{#if !pageId || pageId === page._id}}

    {{#if .pageIsSaving}}
        <div outro="fade" style="position: fixed; z-index: 99999; top: 0; left: 0; width: 100%; height: 100%; background: black; opacity: 0.75;"></div>
    {{/if}}

    {{#if .editMode}}

        <NewPageSectionSelector />
        <GlobalPageSettings settings="{{page.settings}}" pageTitleColorTest="{{pageTitleColorTest}}" />

    {{/if}}

    <div id="page" class="{{#if .editMode}}E{{/if}} {{page.settings.fontType || 'P_font-type-1'}}">

        <div class="P_nonsortable-sections" style="overflow: hidden">

            <h1 style="float: left; font-size: 36px; padding: 20px; color: {{pageTitleColorTest}}">{{page.name}}</h1>

            {{#if .isAdmin}}
                <button style="float: left; margin-top: 28px; margin-left: 10px" on-tap="closePage()">Zavřít</button>
            {{/if}}

            {{#if .editMode}}
                <button style="float: left; margin-top: 28px; margin-left: 10px" on-tap="savePage()">Uložit</button>
            {{/if}}

            {{#each page.sections:sectionIndex}}

                {{#if this.type === "PageSectionHeader"}}
                    <PageSection section="{{this}}" sectionIndex="{{sectionIndex}}" />
                {{/if}}

            {{/each}}

        </div>

        <div class="P_sortable-sections">

            {{#each page.sections:sectionIndex}}

                {{#if this.type !== "PageSectionHeader" && this.type !== "PageSectionFooter"}}
                    {{> this.type}}
<!--                    <PageSection section="{{this}}" sectionIndex="{{sectionIndex}}" />-->
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
