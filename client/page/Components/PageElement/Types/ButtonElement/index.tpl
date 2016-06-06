<span role="{{#if .element.type !== 'button'}}link{{else}}button{{/if}}"
    class="
        P_ButtonElement
        {{#if .element.fill}}P_ButtonElement__fill{{else}}P_ButtonElement__stroke{{/if}}
        {{#if (.element.text[.lang] || '').replace(/\&nbsp\;/ig, ' ').length > (.element.icon ? 20 : 24)}}P_ButtonElement__long-text{{/if}}
        {{#if .element.icon}}P_ButtonElement__has-icon{{/if}}
    "
    style="
        border-color: {{.element.color || .defaultColors.specialColor}};
        {{#if .element.fill}}background-color: {{.element.color || .defaultColors.specialColor}};{{/if}}
    "
    on-enter-tap="@this.action(event, .editMode)"
    intro-outro="{{#if .editMode && @this.findParent('Page').get('loaded') && !.stopTransition}}slidevh{{/if}}"
    tabindex="0"
 >

    <span class="P_ButtonElement--content-wrapper"
        on-touchstart="@this.fire(.editMode ? 'touchstart' : '')"
    >

        {{#if .element.icon && .element.icon.match(/\/svg>/)}}

            <span class="
                    P_ButtonElement--icon P_ButtonElement--icon__svg
                "
                  intro-outro="{{#if .editMode && @this.findParent('Page').get('loaded') && !.stopTransition}}attr{{/if}}"
                  style="color: {{.element.textColor || .element.color || .defaultColors.specialColor}};"
            >
                {{{.element.icon}}}
            </span>

        {{/if}}

        <span class="P_ButtonElement--text-wrapper">
            <span class="
                    P_ButtonElement--text
                "
                contenteditable="{{!!.editMode}}"
                on-blur="@this.removeIfEmpty()"
                value="{{.element.text[.lang]}}"
                style="color: {{.element.textColor || .element.color || .defaultColors.specialColor}};"
            >
            </span>
        </span>

    </span>
 </span>
