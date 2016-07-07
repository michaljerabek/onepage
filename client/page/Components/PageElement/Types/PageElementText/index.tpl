<span class="
             P_PageElementText
             P_PageElementText_{{.source ? .source.replace(/\./g, '-') : 'title'}}
             E_Editor__{{.editor || 'title'}}
             P_font-{{.font || 'title'}}
             lines-{{.lines || 1}}
             scale-{{.scale || 1}}
             "
      style="color: {{.element.textColor || .element.defaultColors.textColor}};"
      contenteditable="{{!!editMode}}"
      on-blur="@this.handleBlur(event)"
      value="{{.element[.source || 'title'][.lang]}}"
      ></span>
{{#if .hasUnderline}}
<span
      class="P_PageElementText--underline"
      style="color: {{.element.specialColor || .element.defaultColors.specialColor}};"
      >
    <span class="P_PageElementText--underline-element"></span>
</span>
{{/if}}

