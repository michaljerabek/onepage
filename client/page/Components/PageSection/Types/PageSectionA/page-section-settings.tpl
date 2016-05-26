<div>
{{#if .openPageSectionSettings === 'colors'}}

    {{> ColorSettings}}

{{/if}}
</div>

<div>
{{#if .openPageSectionSettings === 'background'}}

    <BackgroundImageSettings data="{{.section}}" multipleTabs="[[true]]"/>

{{/if}}
</div>

<div>
{{#if .openPageSectionSettings === 'section'}}

    <SectionSettings data="{{.section}}" lang="{{.lang}}" />

{{/if}}
</div>
