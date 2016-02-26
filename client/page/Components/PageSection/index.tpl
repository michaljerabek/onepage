<section style="min-height: 200px; text-align: center; line-height: 200px; font-size: 32px; border: 1px solid #ddd;">

    {{> .section.type this}}

    {{#if isAdmin}}

        <button on-tap="toggle('openPageSectionSettings')">Upravit</button>

        {{#if .openPageSectionSettings}}

            <section contenteditable="true" value="{{.section.name}}" style="background: #ddd; height: 200px; text-align: center; line-height: 200px; font-size: 32px;"></section>

        {{/if}}

    {{/if}}

</section>
