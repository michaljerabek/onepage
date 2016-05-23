<span class="
    P_PageElementTextContent E_Editor__content
"
style="color: {{.element.textColor || .element.defaultColors.textColor}}"
 contenteditable="{{!!editMode}}" value="{{.element.content}}"
 ></span>
<!--
 <span class="P_PageElementTextContent E_Editor__content"
style="color: {{.element.specialColor || .element.defaultColors.specialColor}}"
 >s. barva</span>
-->
{{#if parseInt(.stop || 0) < 2}}
    <PageElementTextContent activateButton="true" stop="{{!.stop ? 1 : 2}}" element="{{.element}}" />
    <PageElementTextContent activateButton="true" stop="{{!.stop ? 1 : 2}}" element="{{.element}}" />
{{/if}}
