<section class="P_PageSection"
    id="{{.section.id}}"
    data-page-section-internal-id="{{.section.internalId}}"
    data-page-section-name="{{.section.name}}"
    style="background: white;position: relative; text-align: center; line-height: 200px; font-size: 32px;">

    <div class="P_PageSection--inner-wrapper">

        <div class="P_PageSection--section"
            on-hover="handleHover(event)"
            on-touchend="handleTouchend(event)"
            on-touchstart="handleTouchstart(event)"
        >

            {{#if .editMode}}

                <PageSectionMessage />

                <ProgressBar />
               
                {{> pageSectionEditUI}}

            {{/if}}

            <div class="P_PageSection--content {{#if .stopColorTransitions}}E_PageSection__stop-color-transitions{{/if}}">

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
