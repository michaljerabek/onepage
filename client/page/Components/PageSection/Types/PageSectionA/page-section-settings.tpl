{{#if .openPageSectionSettings === 'edit1'}}
<PageSectionSettings data="{{section}}">
    <BackgroundImageSettings />
</PageSectionSettings>
{{/if}}

{{#if .openPageSectionSettings === 'colors'}}
    {{> ColorSettings}}
{{/if}}
