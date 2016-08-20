<span class="P_PageElementEmail">

    {{#if .editMode}}

        <input
            class="P_PageElementEmail--email P_font-title"
            type="email"
            name="email"
            id="P_PageElementEmail--email"
            placeholder="{{.element.placeholder && .element.placeholder[~/lang] ? .element.placeholder[~/lang] : '@'}}"
            value="{{.element.placeholder[~/lang]}}"
            style="color: {{~/buttonColor || ~/defaultColors.specialColor}}"
        >

    {{else}}

        <input
            class="P_PageElementEmail--email P_font-title"
            type="email"
            name="email"
            id="P_PageElementEmail--email"
            placeholder="{{.element.placeholder && .element.placeholder[~/lang] ? .element.placeholder[~/lang] : '@'}}"
            value="{{.email}}"
            style="color: {{~/buttonColor || ~/defaultColors.specialColor}}"
            on-enter="@this.registerEmail(event, .email, .editMode)"
        >

    {{/if}}

    <PageElementButton
        element="{{~/button}}"
        uploadable="false"
        lang="{{~/lang}}"
        tplLang="{{~/tplLang}}"
        color="{{~/buttonColor}}"
        defaultColors="{{~/defaultColors}}"
        action="registerEmail"
        event="{{.email}}"
        actions="false"
        deletable="false"
        defaultText="Odeslat"
        stopTransition="true"
        buttonState="{{~/sendStatus.ok ? @this.BUTTON_STATES.OK : ~/sendStatus.error ? @this.BUTTON_STATES.ERROR : ~/sendStatus.pending ? @this.BUTTON_STATES.PENDING : @this.BUTTON_STATES.DEFAULT}}"
        hasStates="true"
    />

</span>
