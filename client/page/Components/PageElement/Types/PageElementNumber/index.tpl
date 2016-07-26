<span class="
        P_PageElementNumber
        P_PageElementNumber_{{.source ? .source.replace(/\./g, '-') : 'number'}}
        P_font-{{.font || 'body'}}
    "
      style="color: {{(.element && .element[~/colorType || 'textColor']) || .color || (.defaultColors && .defaultColors[~/colorType || 'textColor'])}};"
    contenteditable="{{!!editMode}}"
    on-blur="@this.handleBlur(event)"
    value="{{.element[.source || 'number'][.lang]}}"
></span>

