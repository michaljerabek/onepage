<section class="P_PageSection" data-page-section-name="{{.section.name}}" style="background: white;position: relative; text-align: center; line-height: 200px; font-size: 32px; border: 1px solid #ddd;">

    <div class="P_PageSection--inner-wrapper">

        <div class="P_PageSection--section">

            <div class="P_PageSection--content">
                {{> .section.type}}
            </div>

            {{#if editMode}}
                <span class="P_PageSection--sort-handle" style="background: black; color: white;cursor:pointer;transform: rotate(90deg); position: absolute; top:0; right: 0; width: 40px; heigth: 40px; line-height: 40px; text-align: center">&harr;</span>
                <span on-tap="removeSection" class="P_PageSection--remove" style="background: black; color: white;cursor:pointer; position: absolute; top:0; left: 0; width: 40px; heigth: 40px; line-height: 40px; text-align: center">&times;</span>
            {{/if}}

        </div>

        {{#if editMode}}

            <button on-tap="set('openPageSectionSettings', openPageSectionSettings === 'edit1' ? false : 'edit1')">Upravit 1</button>
            <button on-tap="set('openPageSectionSettings', openPageSectionSettings === 'edit2' ? false : 'edit2')">Upravit 2</button>

            {{#if .openPageSectionSettings === 'edit1'}}
                <PageSectionSettings data="{{section}}" delayOpening="{{anotherSettingsOpened}}" />
            {{/if}}

            {{#if .openPageSectionSettings === 'edit2'}}
                <PageSectionSettings data="{{section}}" delayOpening="{{anotherSettingsOpened}}" />
            {{/if}}

        {{/if}}
    </div>

</section>
