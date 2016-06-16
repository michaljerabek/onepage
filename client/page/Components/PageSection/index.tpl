<section class="
        P_PageSection
        P_{{.section.type || 'PageSectionType'}}
        P_{{.section.type || 'PageSectionType'}}__{{.section.layout || 'default'}}
        {{#if .section.fullSize || .fullSize}}P_PageSection__full-size{{/if}}
    "
    id="{{.section.id[.lang]}}"
    data-page-section-internal-id="{{.section.internalId}}"
    data-page-section-name="{{.section.name[.lang]}}"
>

    <div class="P_PageSection--inner-wrapper">

        <div class="P_PageSection--section"
            on-hover="@this.handleHover(event)"
            on-touchend="@this.handleTouchend(event)"
            on-touchstart="@this.handleTouchstart(event)"
        >

            {{#if .editMode}}

                <PageSectionMessage />

                <ProgressBar />
               
                {{> pageSectionEditUI}}

            {{/if}}

            <div class="
                    P_PageSection--content
                    {{#if .section.backgroundImage.src}}P_PageSection__shadow-{{.section.addShadow || 0}}{{/if}}
                    {{#if .stopColorTransitions}}E_PageSection__stop-color-transitions{{/if}}
                    {{#if .changeOutlineColor}}E_PageSection__change-outline{{/if}}
                "
            >

                <div class="P_PageSection--background-color" style="background-color: {{.section.backgroundColor || .section.defaultColors.backgroundColor}}">

                    {{> pageSectionContent}}

                </div>

            </div>

        </div>

        {{#if .editMode}}
            {{> pageSectionSettings}}
        {{/if}}

    </div>

</section>
