<span class="
        P_PageElementTitle P_PageElementTitle_{{.source || 'title'}} E_Editor__title P_font-title
        lines-{{.lines || 1}}
        scale-{{.scale || 1}}
    "
    style="color: {{.element.textColor || .element.defaultColors.textColor}};"
    contenteditable="{{!!editMode}}"
    on-blur="@this.handleBlur(event)"
    value="{{.element[.source || 'title'][.lang]}}"
></span>
