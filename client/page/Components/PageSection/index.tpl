<section style="min-height: 200px; text-align: center; line-height: 200px; font-size: 32px; border: 1px solid #ddd;">

    {{> .section.type this}}

    {{#if isAdmin}}

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
