{{#if .openPageSectionSettings === 'edit1'}}
<PageSectionSettings data="{{section}}">
    <div contenteditable="true" value="{{.data.name}}"></div>

</PageSectionSettings>
{{/if}}

{{#if .openPageSectionSettings === 'edit2'}}
<PageSectionSettings data="{{section}}">
    <div contenteditable="true" value="{{.data.name}}"></div>

</PageSectionSettings>
{{/if}}
