{{#if .colors && .colors.length}}

<div intro="fade" class="ColorPickerPalette">

    <h6 class="ColorPickerPalette--title">{{.title}}</h6>

    <div class="ColorPickerPalette--colors">

        {{#each .colors:i}}

            {{>Color}}

        {{/each}}

        {{#if .addNoColor}}

            {{>NoColor}}

        {{/if}}

    </div><!--/ColorPickerPalette--colors-->

</div><!--/ColorPickerPalette-->

{{/if}}

{{#partial Color}}
<div class="ColorPickerPalette--color

            {{#if ~/type === ~/TYPE_DEFAULT && i === 0 && output === ''}}
                ColorPickerPalette--color__remove{{#if ~/nearToBlack}}-black{{/if}}
            {{/if}}
            "
     intro="fade"
     style="
            background-color: {{this}};
            transition: {{animate ? '' : 'none'}};
            "
     on-click-touchend="setColor:{{this}},{{true}}"
     title="
            {{#if ~/type === ~/TYPE_DEFAULT}}
                {{#if i === 0}}
                    Vybraná: {{formatColor(this, inputType)}}
                {{else}}
                    Původní: {{formatColor(this, inputType)}}
                {{/if}}
            {{else}}
                {{formatColor(this, inputType)}}
            {{/if}}
        "
></div><!--/ColorPickerPalette--color-->
{{/partial}}

{{#partial NoColor}}
<div class="ColorPickerPalette--color ColorPickerPalette--color__remove"
     intro="fade"
     on-click-touchend="setColor:{{NO_COLOR}}"
     title="Odstranit / Výchozí"
></div>
{{/partial}}
