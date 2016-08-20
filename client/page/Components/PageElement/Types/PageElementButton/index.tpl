<span role="{{#if .element.type !== 'button'}}link{{else}}button{{/if}}"
    class="
        P_PageElementButton
        {{#if .element.fill}}P_PageElementButton__fill{{else}}P_PageElementButton__stroke{{/if}}
        {{#if ((.element.text && .element.text[.lang]) || '').replace(/\&nbsp\;/ig, ' ').length > (.element.icon && !.element.hideIcon ? 20 : 24)}}P_PageElementButton__long-text{{/if}}
        {{#if .element.icon && !.element.hideIcon}}P_PageElementButton__has-icon{{/if}}
        P_font-title
        P_PageElementButton__{{@this.STATE_NAMES[.buttonState || @this.STATES.DEFAULT]}}
    "
    style="
        border-color: {{.element.color || .color || .defaultColors.specialColor}};
        {{#if .element.fill}}background-color: {{.element.color || .color || .defaultColors.specialColor}};{{/if}}
    "
    on-enter-tap=".action ? @this.fire(.action, event, ~/event, .editMode) : @this.action(event, .editMode)"
    intro="{{#if .editMode && ~/pageLoaded && !~/stopTransition}}slidevh{{/if}}"
    outro="{{#if .editMode && ~/pageLoaded && !~/stopTransition}}slidevh{{/if}}"
    tabindex="0"
 >

    <span class="P_PageElementButton--content-wrapper"
        on-touchstart="@this.fire(.editMode ? 'touchstart' : '')"
    >

        {{#if .element.icon && !.element.hideIcon && .element.icon.match(/\/svg>/)}}

            <span class="
                    P_PageElementButton--icon P_PageElementButton--icon__svg
                "
                intro="{{#if .editMode && ~/pageLoaded && !~/stopTransition}}attr{{/if}}"
                outro="{{#if .editMode && ~/pageLoaded && !~/stopTransition}}attr{{/if}}"
                style="
                    {{#if .element.fill}}
                        color: {{.element.userTextColor || .element.textColor || .element.color || .color || .defaultColors.specialColor}};
                    {{else}}
                        color: {{.element.textColor || .element.color || .color || .defaultColors.specialColor}};
                    {{/if}}
                "
            >
                {{{.element.icon}}}
            </span>

        {{/if}}

        <span class="P_PageElementButton--text-wrapper">
            <span class="
                    P_PageElementButton--text
                "
                contenteditable="{{!!.editMode}}"
                on-blur=".editMode && @this.removeNbsp(), .editMode && @this.removeIfEmpty()"
                on-keydown="@this.hideEditUI()"
                value="{{.element.text[.lang]}}"
                style="
                    {{#if .element.fill}}
                        color: {{.element.userTextColor || .element.textColor || .element.color || .color || .defaultColors.specialColor}};
                    {{else}}
                        color: {{.element.textColor || .element.color || .color || .defaultColors.specialColor}};
                    {{/if}}
                "
            >
            </span>

            {{#if .hasStates}}

                <span class="P_PageElementButton--state P_PageElementButton--state__ok">
                    <svg viewBox="0 0 32 32" style="color: {{.element.userTextColor || .element.textColor || .element.color || .color || .defaultColors.specialColor}};">
                        <polygon points="11,27.4 0.3,16.7 1.7,15.3 11,24.6 30.3,5.3 31.7,6.7"/>
                    </svg>
                </span>

                <span class="P_PageElementButton--state P_PageElementButton--state__warn">

                </span>

                <span class="P_PageElementButton--state P_PageElementButton--state__pending">
                    <svg viewBox="0 0 32 32" style="color: {{.element.userTextColor || .element.textColor || .element.color || .color || .defaultColors.specialColor}};">
                        <g>
                            <path d="M31.9,24.3l-3.3-6.4l-6.5,2.4l0.7,1.9l3.7-1.4c-1.8,4.3-6,7.2-10.7,7.2c-5.3,0-10-3.7-11.3-9l-1.9,0.5C4.1,25.7,9.5,30,15.8,30c5.5,0,10.4-3.3,12.5-8.3l1.8,3.5L31.9,24.3z"/>
                            <path d="M9.6,11.5L9.1,9.6l-3.8,1c2-4,6-6.7,10.5-6.7c5.2,0,9.7,3.4,11.2,8.4l1.9-0.6C27.1,6,21.8,2,15.8,2C10.5,2,5.8,5,3.5,9.7L1.9,6.2L0.1,7.1l3,6.3L9.6,11.5z"/>
                        </g>
                    </svg>
                </span>

                <span class="P_PageElementButton--state P_PageElementButton--state__error">
                    <svg viewBox="0 0 32 32" style="color: {{.element.userTextColor || .element.textColor || .element.color || .color || .defaultColors.specialColor}};">
                        <polygon points="29.7,3.7 28.3,2.3 16,14.6 3.7,2.3 2.3,3.7 14.6,16 2.3,28.3 3.7,29.7 16,17.4 28.3,29.7 29.7,28.3 17.4,16 "/>
                    </svg>
                </span>

            {{/if}}
        </span>

    </span>
 </span>
