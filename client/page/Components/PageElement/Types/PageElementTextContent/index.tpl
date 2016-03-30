<span class="P_PageElementTextContent E_Editor__content" style="color: {{.element.color}}" contenteditable="{{!!editMode}}" value="{{.element.name}}"></span>
{{#if !stop}}
    <PageElementTextContent stop="true" element="{{.element}}" />
    <PageElementTextContent stop="true" element="{{.element}}" />
{{/if}}
