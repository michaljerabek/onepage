<BackgroundImage data="{{.section.backgroundImage}}" />

<PageElementTitle element="{{.section}}" activateButton="true" lang="{{.lang}}" tplLang="{{.tplLang}}"/>

{{#if .section.button}}
<ButtonElement element="{{.section.button}}" defaultColors="{{.section.defaultColors}}" lang="{{.lang}}" tplLang="{{.tplLang}}" />
{{/if}}

