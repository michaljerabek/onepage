<div class="E_PageSectionSettings--transition-wrapper">
{{#if ~/openPageSectionSettings === 'colors'}}

    {{> ColorSettings}}

{{/if}}
</div>

<div class="E_PageSectionSettings--transition-wrapper">
{{#if ~/openPageSectionSettings === 'background'}}

    <BackgroundImageSettings data="{{.section}}" multipleTabs="[[true]]"/>

{{/if}}
</div>

<div class="E_PageSectionSettings--transition-wrapper">
{{#if ~/openPageSectionSettings === 'section'}}

    <SectionSettings data="{{.section}}" layoutTemplate="layoutClaim" lang="{{.lang}}" />

{{/if}}
</div>
