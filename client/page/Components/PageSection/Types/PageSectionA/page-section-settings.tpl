{{#if .openPageSectionSettings === 'edit1'}}
<PageSectionSettings data="{{.section}}">
    <BackgroundImageSettings data="{{.data}}" />
</PageSectionSettings>
{{/if}}

{{#if .openPageSectionSettings === 'colors'}}
    {{> ColorSettings}}
{{/if}}
