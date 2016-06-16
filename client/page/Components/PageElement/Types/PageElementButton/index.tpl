<span role="{{#if .element.type !== 'button'}}link{{else}}button{{/if}}"
    class="
        P_PageElementButton
        {{#if .element.fill}}P_PageElementButton__fill{{else}}P_PageElementButton__stroke{{/if}}
        {{#if ((.element.text && .element.text[.lang]) || '').replace(/\&nbsp\;/ig, ' ').length > (.element.icon && !.element.hideIcon ? 20 : 24)}}P_PageElementButton__long-text{{/if}}
        {{#if .element.icon && !.element.hideIcon}}P_PageElementButton__has-icon{{/if}}
        P_font-title
    "
    style="
        border-color: {{.element.color || .color || .defaultColors.specialColor}};
        {{#if .element.fill}}background-color: {{.element.color || .color || .defaultColors.specialColor}};{{/if}}
    "
    on-enter-tap="@this.action(event, .editMode)"
    intro-outro="{{#if .editMode && @this.Page.get('loaded') && !.stopTransition}}slidevh{{/if}}"
    tabindex="0"
 >

    <span class="P_PageElementButton--content-wrapper"
        on-touchstart="@this.fire(.editMode ? 'touchstart' : '')"
    >

        {{#if .element.icon && !.element.hideIcon && .element.icon.match(/\/svg>/)}}

            <span class="
                    P_PageElementButton--icon P_PageElementButton--icon__svg
                "
                  intro-outro="{{#if .editMode && @this.Page.get('loaded') && !.stopTransition}}attr{{/if}}"
                  style="color: {{.element.textColor || .element.color || .color || .defaultColors.specialColor}};"
            >
                {{{.element.icon}}}
            </span>

        {{/if}}

        <span class="P_PageElementButton--text-wrapper">
            <span class="
                    P_PageElementButton--text
                "
                contenteditable="{{!!.editMode}}"
                on-blur="@this.removeIfEmpty()"
                on-keydown="@this.hideEditUI()"
                value="{{.element.text[.lang]}}"
                style="color: {{.element.textColor || .element.color || .color || .defaultColors.specialColor}};"
            >
            </span>
        </span>

    </span>
 </span>
