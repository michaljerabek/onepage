{{#if .editMode}}

    <span class="
            P_PageElementLogo
        "
        slidevh-in="{duration: .editMode && ~/pageLoaded && !.stopTransition ? 300 : 0}"
        slidevh-out="{duration: .editMode && ~/pageLoaded && !.stopTransition ? 300 : 0}"
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

    <a href="#{{@this.PageSection.get('internalId')}}"
       data-href="#{{@this.PageSection.get('internalId')}}"
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
