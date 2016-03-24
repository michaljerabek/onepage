{{#if .openPageSectionSettings === 'edit1'}}
<PageSectionSettings data="{{section}}">
    <BackgroundImageSettings />
</PageSectionSettings>
{{/if}}

{{#if .openPageSectionSettings === 'edit2'}}
    {{> ColorSettings}}
{{/if}}
