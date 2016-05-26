<div>
{{#if .openPageSectionSettings === 'background'}}
<PageSectionSettings data="{{.section}}">
    <div contenteditable="true" value="{{.data.name}}"></div>
</PageSectionSettings>
{{/if}}
</div>

<div>
{{#if .openPageSectionSettings === 'section'}}
<SectionSettings data="{{.section}}" lang="{{.lang}}" />
{{/if}}
</div>

<div>
{{#if .openPageSectionSettings === 'colors'}}
    {{> ColorSettings}}
{{/if}}
</div>
