{{#if !pageId || pageId === page._id}}

    {{#if .editMode}}

        {{#if .pageIsSaving}}
            <div outro="fade" style="position: fixed; z-index: 99999; top: 0; left: 0; width: 100%; height: 100%; background: black; opacity: 0.75;"></div>
        {{/if}}


        {{> pageMenu}}

    {{/if}}

    <div id="page" class="{{#if .editMode}}E{{/if}} {{.page.settings.fontType || 'P_font-type-1'}} {{.sortableActive}}">

        <div class="P_nonsortable-sections" style="overflow: hidden">

            <h1 style="float: left; font-size: 36px; padding: 20px; color: {{pageTitleColorTest}}">{{page.name}}</h1>

            {{#each .page.sections}}

                {{#if this.type === "PageSectionHeader"}}
                    {{> this.type}}
                {{/if}}

            {{/each}}

        </div>

        <div class="P_sortable-sections">{{#each .page.sections}}

                {{#if this.type !== "PageSectionHeader" && this.type !== "PageSectionFooter"}}
                    {{> this.type}}
                {{/if}}

        {{/each}}</div>

        <div class="P_nonsortable-sections">

            {{#each .page.sections}}

                {{#if this.type === "PageSectionFooter"}}
                    {{> this.type}}
                {{/if}}

            {{/each}}

        </div>

    </div>
{{/if}}
