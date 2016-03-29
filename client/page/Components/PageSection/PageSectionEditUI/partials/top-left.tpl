{{#if .removeSectionButton !== false}}
    <span on-tap="removeSection:{{.section.type}}" class="P_PageSection--remove" style="background: black; color: white;cursor:pointer; position: absolute; top:0; left: 0; width: 40px; heigth: 40px; line-height: 40px; text-align: center">&times;</span>
{{/if}}
