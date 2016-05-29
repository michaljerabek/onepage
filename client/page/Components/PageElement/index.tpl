<div class="
        P_PageElement
        {{#if .editMode}}
            E_PageElement
            {{#if @this.isEmpty && @this.isEmpty()}}E_PageElement__empty{{/if}}
            E_PageElement__{{.state}}
        {{/if}}
        P_PageElement__[[.type || 'unknown-type']]
    "
    on-hover="@this.handleHover(event)"
>

    {{#if .editMode}}

        {{#if .activateButton}}

            <div class="E_PageElement--activate" on-tap="@this.fire('activate', event)">
                <svg width="24" height="24"><use xlink:href="{{.activateIcon || '#icon-plus'}}"></use></svg>
            </div>

        {{/if}}

        <div class="
                E_PageElement--outline
                {{#if .showOutline}}E_PageElement--outline__active{{/if}}
                {{#if .limitSize}}E_PageElement--outline__limited{{/if}}
            "
            on-touchstart="@this.handleTouchstart(event)"
            on-touchend="@this.handleTouchend(event)"
        >
        </div>

        {{#if .hasEditUI}}
            <div class="E_PageElement--EditUI E_PageElementEditUI">
                {{> pageElementEditUI}}
            </div>
        {{/if}}

    {{/if}}

    {{> pageElementContent}}

</div>
