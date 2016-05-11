<span class="P_PageElementTextContent E_Editor__content" style="color: {{.element.textColor}}" contenteditable="{{!!editMode}}" value="{{.element.content}}"></span>
{{#if parseInt(.stop || 0) < 2}}
    <PageElementTextContent stop="{{!.stop ? 1 : 2}}" element="{{.element}}" />
    <PageElementTextContent stop="{{!.stop ? 1 : 2}}" element="{{.element}}" />
{{/if}}
