{{#if .openPageSectionSettings === 'colors'}}

    {{> ColorSettings}}

{{elseif .openPageSectionSettings === 'background'}}

    <BackgroundImageSettings data="{{.section}}" multipleTabs="[[true]]"/>

{{elseif .openPageSectionSettings === 'section'}}

    <SectionSettings data="{{.section}}" />

{{/if}}
