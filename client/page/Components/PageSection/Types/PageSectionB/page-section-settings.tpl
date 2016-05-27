<div class="E_PageSectionSettings--transition-wrapper">
{{#if .openPageSectionSettings === 'background'}}
<PageSectionSettings data="{{.section}}">
    <div contenteditable="true" value="{{.data.name}}"></div>
</PageSectionSettings>
{{/if}}
</div>

<div class="E_PageSectionSettings--transition-wrapper">
{{#if .openPageSectionSettings === 'section'}}
<SectionSettings data="{{.section}}" lang="{{.lang}}" />
{{/if}}
</div>

<div class="E_PageSectionSettings--transition-wrapper">
{{#if .openPageSectionSettings === 'colors'}}
    {{> ColorSettings}}
{{/if}}
</div>
