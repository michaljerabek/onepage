<span class="P_PageElementTextContent E_Editor__content" style="color: {{.element.color}}" contenteditable="{{!!editMode}}" value="{{.element.name}}"></span>
{{#if parseInt(.stop || 0) < 2}}
    <PageElementTextContent stop="{{!.stop ? 1 : 2}}" element="{{.element}}" />
    <PageElementTextContent stop="{{!.stop ? 1 : 2}}" element="{{.element}}" />
{{/if}}