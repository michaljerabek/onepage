{{#if .openPageSectionSettings === 'background'}}
<PageSectionSettings data="{{section}}">
    <div contenteditable="true" value="{{.data.name}}"></div>

</PageSectionSettings>
{{/if}}

{{#if .openPageSectionSettings === 'section'}}
<PageSectionSettings data="{{.section}}">
    <SectionSettings data="{{.data}}" />
</PageSectionSettings>
{{/if}}

{{#if .openPageSectionSettings === 'colors'}}
    {{> ColorSettings}}
{{/if}}
