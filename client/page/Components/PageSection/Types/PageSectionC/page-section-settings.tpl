{{#if .openPageSectionSettings === 'background'}}
<PageSectionSettings data="{{.section}}">
    <div contenteditable="true" value="{{.data.name}}"></div>
</PageSectionSettings>
{{/if}}

{{#if .openPageSectionSettings === 'section'}}
<SectionSettings data="{{.section}}" />
{{/if}}

{{#if .openPageSectionSettings === 'colors'}}
    {{> ColorSettings}}
{{/if}}
