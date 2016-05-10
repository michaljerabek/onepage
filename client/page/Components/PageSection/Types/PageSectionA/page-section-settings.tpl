{{#if .openPageSectionSettings === 'background'}}
<PageSectionSettings data="{{.section}}" multipleTabs="[[true]]">
    <BackgroundImageSettings data="{{.data}}" />
</PageSectionSettings>
{{/if}}

{{#if .openPageSectionSettings === 'colors'}}
    {{> ColorSettings}}
{{/if}}
