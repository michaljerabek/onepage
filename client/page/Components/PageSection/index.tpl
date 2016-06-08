<section class="P_PageSection"
    id="{{.section.id[.lang]}}"
    data-page-section-internal-id="{{.section.internalId}}"
    data-page-section-name="{{.section.name[.lang]}}"
    style="background: white;position: relative; text-align: center; line-height: 200px; font-size: 32px;">

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

            <div class="P_PageSection--content {{#if .stopColorTransitions}}E_PageSection__stop-color-transitions{{/if}} {{#if .changeOutlineColor}}E_PageSection__change-outline{{/if}}">

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
