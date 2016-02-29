<section class="P_PageSection" style="background: white;position: relative; text-align: center; line-height: 200px; font-size: 32px; border: 1px solid #ddd;">

    {{> .section.type this}}

    {{#if isAdmin}}

        <span class="E_PageSection--sort-handle" style="background: black; color: white;cursor:pointer;transform: rotate(90deg); position: absolute; top:0; right: 0; width: 40px; heigth: 40px; line-height: 40px; text-align: center">&harr;</span>

        <button on-tap="set('openPageSectionSettings', openPageSectionSettings === 'edit1' ? false : 'edit1')">Upravit 1</button>
        <button on-tap="set('openPageSectionSettings', openPageSectionSettings === 'edit2' ? false : 'edit2')">Upravit 2</button>

        {{#if .openPageSectionSettings === 'edit1'}}
            <PageSectionSettings data="{{section}}" delayOpening="{{anotherSettingsOpened}}" />
        {{/if}}

        {{#if .openPageSectionSettings === 'edit2'}}
            <PageSectionSettings data="{{section}}" delayOpening="{{anotherSettingsOpened}}" />
        {{/if}}

    {{/if}}

</section>
