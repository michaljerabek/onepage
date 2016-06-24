{{#if .editMode}}

    <span class="
            P_PageElementLogo
        "
        intro-outro="{{#if .editMode && @this.Page.get('loaded') && !.stopTransition}}slidevh{{/if}}"
        tabindex="0"
     >
        <div class="P_PageElementLogo--image"
            style="
                width: {{.element.image ? .element.width || 52 : 0}}px;
                {{#if .element.image}}background-image: url({{.element.image}});{{/if}}
            "
        >
        </div>
</span>

{{else}}

    <a href="/{{.lang === @this.root.get('page.settings.lang.defaultLang') ? '' : .lang}}"
        class="
            P_PageElementLogo
        "
        tabindex="0"
    >
        <div class="P_PageElementLogo--image"
            style="
                width: {{.element.image ? .element.width || 52 : 0}}px;
                {{#if .element.image}}background-image: url({{.element.image}});{{/if}}
            "
        >
        </div>
    </a>

{{/if}}
