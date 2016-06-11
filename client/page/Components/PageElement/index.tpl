<div class="
        P_PageElement
        {{#if .editMode}}
            E_PageElement
            E_PageElement__{{.state}}
            {{#if .sorting}}E_PageElement__sorting{{/if}}
            {{#if @this.isEmpty && @this.isEmpty()}}E_PageElement__empty{{/if}}
        {{/if}}
        {{#if @this.isEmpty && @this.isEmpty()}}P_PageElement__empty{{/if}}
        P_PageElement__[[.type || 'unknown-type']]
        {{.specialClass1}} {{.specialClass2}} {{.specialClass3}}
    "
    on-hover="@this.handleHover(event)"
    id="{{.id}}"
    intro-outro="{{#if @this.Page.get('loaded') && !.stopTransition}}attr{{/if}}"
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
            <div class="E_PageElement--EditUI E_PageElementEditUI {{#if .hideEditUI}}E_PageElementEditUI__hidden{{/if}}">
                {{> pageElementEditUI}}
            </div>
        {{/if}}

        {{#if .uploadable}}

            <div class="E_PageElement--upload-overlay"></div>

        {{/if}}

    {{/if}}

    {{> pageElementContent}}

</div>
