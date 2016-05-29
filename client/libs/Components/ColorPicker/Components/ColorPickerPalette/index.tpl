{{#if .colors.length}}

<div intro="fade" class="ColorPickerPalette">

    {{#if .images}}

        {{#with Date.now() + (Math.random() * 10000).toFixed() as selectId}}

        <label class="ColorPickerPalette--title" for="ColorPickerPalette--{{selectId}}">
            <select id="ColorPickerPalette--{{selectId}}" class="ColorPickerPalette--image-selector" value="{{.image}}">
                {{#each .images}}
                    <option value="{{.src}}">{{.name}}</option>
                {{/each}}
            </select>
            {{#each .images}}
                {{#if .src === ~/image}}
                    <span class="
                            ColorPickerPalette--title-image
                            {{#if ~/processing}}ColorPickerPalette--title-image__processing{{/if}}
                        "
                    >{{.name}}</span>
                {{/if}}
            {{/each}}
            <span class="ColorPickerPalette--title-self">{{.title}}</span>
            <svg class="ColorPickerPalette--icon"><use xlink:href="#icon-triangle"></use></svg>
        </label>

        {{/with}}

    {{else}}

        <h6 class="ColorPickerPalette--title">{{.title}}</h6>

    {{/if}}

    <div class="ColorPickerPalette--colors">

        {{#each .colors:i}}

            {{>Color {i: i, output: output, color: this, inputType: inputType}}}

        {{/each}}

        {{#if .addNoColor}}

            {{>NoColor}}

        {{/if}}

    </div><!--/ColorPickerPalette--colors-->

</div><!--/ColorPickerPalette-->

{{/if}}

{{#partial Color}}
<div class="ColorPickerPalette--color

        {{#if ~/type === ~/TYPE_DEFAULT && .i === 0 && .output === ''}}
            ColorPickerPalette--color__remove{{#if ~/nearToBlack}}-black{{/if}}
        {{/if}}
    "
    on-click-touchend="@this.fire('setColor', event, .color, true, @this)"
    intro="fade"
    style="
        background-color: {{.color}};
        transition: {{animate ? '' : 'none'}};
    "
    title="
        {{#if ~/type === ~/TYPE_DEFAULT}}
            {{#if i === 0}}
                Vybraná: {{formatColor(.color, .inputType)}}
            {{else}}
                Původní: {{formatColor(.color, .inputType)}}
            {{/if}}
        {{else}}
            {{formatColor(.color, .inputType)}}
        {{/if}}
    "
></div><!--/ColorPickerPalette--color-->
{{/partial}}

{{#partial NoColor}}
<div class="ColorPickerPalette--color ColorPickerPalette--color__remove"
     intro="fade"
     on-click-touchend="@this.fire('setColor', event, NO_COLOR, false, @this)"
     title="Odstranit / Výchozí"
></div>
{{/partial}}
