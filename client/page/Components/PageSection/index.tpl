<section id="{{.section.id}}" data-page-section-internal-id="{{.section.internalId}}" class="P_PageSection" data-page-section-name="{{.section.name}}" style="background: white;position: relative; text-align: center; line-height: 200px; font-size: 32px; border: 1px solid #ddd;">

    <div class="P_PageSection--inner-wrapper">

        <div class="P_PageSection--section">

            <div class="P_PageSection--content">
                {{> .section.type}}
            </div>

            {{#if editMode}}
                <PageSectionEditUI section="{{.section}}" />
            {{/if}}

        </div>

        {{#if editMode}}
            {{>.section.type + "Settings"}}
        {{/if}}
    </div>

</section>
