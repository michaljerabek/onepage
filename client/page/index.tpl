{{#if !pageId || pageId === page._id}}

    {{#if .editMode}}

        {{#if .pageIsSaving}}
            <div fade-out style="position: fixed; z-index: 99999; top: 0; left: 0; width: 100%; height: 100%; background: black; opacity: 0.75;"></div>
        {{/if}}

        {{> pageMenu}}

    {{/if}}

    <div id="windowEvents" style="display: none;"
        on-windowResize="@this.root.set('windowWidth', event.innerWidth)"
        on-windowTouchstart="@this.root.set('touchmove', false) || true"
        on-windowTouchmove="!!(!@this.root.get('touchmove') && @this.root.set('touchmove', true)) || true"
    ></div>

    <div id="page" class="{{#if .editMode}}E{{else}}P{{/if}}
            {{.sortableActive}}
            {{#if .loaded}}P_Page__loaded{{/if}}

            {{.page.settings.fontType || .defaults.settings.fontType}}
            P_roundness-{{.page.settings.roundness || .defaults.settings.roundness}}
            P_animations-{{.page.settings.animations || .defaults.settings.animations}}
            {{#if .page.settings.underlineTitles}}P_underline-titles{{/if}}
        "
    >

        <div class="P_nonsortable-sections">

            {{#each .page.sections}}

                {{#if this.type === "PageSectionHeader"}}
                    {{> this.type}}
                {{/if}}

            {{/each}}

        </div>

        <div class="P_sortable-sections">{{#each .page.sections}}

                {{#if this.type && this.type !== "PageSectionHeader" && this.type !== "PageSectionFooter"}}
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
